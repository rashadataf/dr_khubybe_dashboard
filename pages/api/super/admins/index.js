import { getSession } from "next-auth/client";
import nextConnect from "next-connect";
import multer from "multer";
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "../../../../util/mongodb";

const fileStorage = multer.diskStorage({
  destination: "images",
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  limits: { fieldSize: 25 * 1024 * 1024 },
  fileFilter: fileFilter,
});

const apiRoute = nextConnect({});

const uploadMiddleware = upload.single("image");

apiRoute.use(uploadMiddleware);
apiRoute.post(async (req, res) => {
  try {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).send({ message: "not authenticated!" });
      return;
    }
    const superEmail = session.user.email;
    const { client, db } = await connectToDatabase();
    const admins = db.collection("admins");
    const superAdmin = await admins.findOne({ email: superEmail });
    if (!superAdmin) {
      res.status(401).send({ message: "not authenticated!" });
      return;
    }
    if (superAdmin.role !== "super") {
      res.status(401).send({ message: "not authenticated!" });
      return;
    }
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    let name = req.body.name;
    if (name.length === 0) {
      throw new Error("name can't be empty!");
    }
    let phone = req.body.phone;
    if (phone.length === 0) {
      throw new Error("phone can't be empty!");
    } else {
      if (isNaN(parseInt(phone))) throw new Error("an invalid phone number!");
    }
    let email = req.body.email;
    if (email.length === 0) {
      throw new Error("email can't be empty!");
    } else {
      let emailFilter = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      let isEmail = emailFilter.test(email);
      if (!isEmail) {
        throw new Error("an invalid email!");
      }
    }
    if (email.trim() === superEmail.trim()) {
      res.status(409).send({ message: "email already exists" });
      return;
    }
    const newAdmin = await admins.findOne({ email: email });
    if (newAdmin) {
      res.status(409).send({ message: "email already exists" });
      return;
    }
    let password = req.body.password;
    let passwordError = "";
    if (!/[a-z]/.test(password)) {
      passwordError =
        passwordError + "\nyou should enter one Lowercase character at least!";
    }
    if (!/[A-Z]/.test(password)) {
      passwordError =
        passwordError + `\nyou should enter one Uppercase character at least!`;
    }
    if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      passwordError =
        passwordError + "\nyou should enter one Symbol(@#$%...) at least!";
    }
    if (password.length < 6) {
      passwordError =
        passwordError + "\nyou should enter 6 characters at least!";
    }
    if (passwordError.length > 0) {
      throw new Error("password should be stronger!");
    }
    password = String(password);
    password = await bcryptjs.hash(password, 10);
    let role = "admin";
    let status = "active";

    const result = admins.insertOne({
      name,
      phone,
      email,
      imageUrl,
      role,
      status,
      password,
    });
    res.send(true);
  } catch (error) {
    res.status(400).send({ message: error.toString() });
  }
});

apiRoute.get(async (req, res) => {
  try {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).send({ message: "not authenticated!" });
      return;
    }
    const superEmail = session.user.email;
    const { client, db } = await connectToDatabase();
    const admins = db.collection("admins");
    const superAdmin = await admins.findOne({ email: superEmail });
    if (!superAdmin) {
      res.status(401).send({ message: "not authenticated!" });
      return;
    }
    if (superAdmin.role !== "super") {
      res.status(401).send({ message: "not authenticated!" });
      return;
    }
    const result = await admins.find({}).toArray();
    result.forEach((admin) => {
      delete admin.password;
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: "there was an error happened!" });
  }
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
