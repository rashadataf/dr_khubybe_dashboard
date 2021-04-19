import { getSession } from "next-auth/client";
import mongodb from "mongodb";
import { connectToDatabase } from "../../../../util/mongodb";
import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";
import bcryptjs from "bcryptjs";

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

// apiRoute.get(async (req, res) => {
//   const {
//     query: { id },
//   } = req;
//   try {
//     const { client, db } = await connectToDatabase();
//     const blog = db.collection("blogs").find({ _id: new mongodb.ObjectID(id) });
//     delete blog.password;
//     res.status(200).send(blog);
//   } catch (error) {
//     res.status(400).send({ error: "there was an error happened!" });
//   }
// });

apiRoute.put(async (req, res) => {
  const {
    query: { id },
  } = req;
  try {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
    const superEmail = session.user.email;
    const { client, db } = await connectToDatabase();
    const admins = db.collection("admins");
    const superAdmin = await admins.findOne({ email: superEmail });
    if (!superAdmin) {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
    if (superAdmin.role !== "super") {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      if (req.body.image !== "null") {
        imageUrl = req.body.image;
      }
    }
    const name = req.body.name;
    if (name.length === 0) {
      throw new Error("name can't be empty!");
    }
    const phone = req.body.phone;
    if (phone.length === 0) {
      throw new Error("phone can't be empty!");
    } else {
      if (isNaN(parseInt(phone))) throw new Error("an invalid phone number!");
    }
    const email = req.body.email;
    if (email.length === 0) {
      throw new Error("email can't be empty!");
    } else {
      let emailFilter = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      let isEmail = emailFilter.test(email);
      if (!isEmail) {
        throw new Error("an invalid email!");
      }
    }

    const status = req.body.status;
    let updatedAdmin = {
      name,
      phone,
      imageUrl,
    };
    const admin = await admins.findOne({ _id: new mongodb.ObjectID(id) });

    let newAdmin = await admins.findOne({ email: email });
    if (newAdmin) {
      if (email !== admin.email) {
        res.status(409).send({ message: "email already exists" });
        return;
      }
    }
    updatedAdmin.email = email;
    if (status === "active" || status === "inactive") {
      updatedAdmin.status = status;
    }
    if (admin.imageUrl) {
      if (imageUrl) {
        if (imageUrl !== admin.imageUrl) {
          fs.unlinkSync(path.join(process.cwd(), admin.imageUrl));
        }
      } else {
        fs.unlinkSync(path.join(process.cwd(), admin.imageUrl));
      }
    }
    let password = req.body.password;
    if (password.length > 0) {
      let passwordError = "";
      if (!/[a-z]/.test(password)) {
        passwordError =
          passwordError +
          "\nyou should enter one Lowercase character at least!";
      }
      if (!/[A-Z]/.test(password)) {
        passwordError =
          passwordError +
          `\nyou should enter one Uppercase character at least!`;
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
      } else {
        password = String(password);
        password = await bcryptjs.hash(password, 10);
        updatedAdmin.password = password;
      }
    }
    const result = await admins.updateOne(
      { _id: new mongodb.ObjectID(id) },
      {
        $set: { ...updatedAdmin },
      }
    );
    res.send(true);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

apiRoute.delete(async (req, res) => {
  const {
    query: { id },
  } = req;
  try {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
    const superEmail = session.user.email;
    const { client, db } = await connectToDatabase();
    const admins = db.collection("admins");
    const superAdmin = await admins.findOne({ email: superEmail });
    if (!superAdmin) {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
    if (superAdmin.role !== "super") {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }

    const adminToDelete = await admins.findOne({
      _id: new mongodb.ObjectID(id),
    });
    if (adminToDelete) {
      if (adminToDelete.email === superEmail) {
        res.status(401).send({ message: "You Can't Delete Super Admin!" });
        return;
      }
    }

    const deletedAdmin = await admins.findOneAndDelete({
      _id: new mongodb.ObjectID(id),
    });
    let image = deletedAdmin.value.imageUrl;
    if (image && image !== "null") {
      fs.unlinkSync(path.join(process.cwd(), image));
    }
    res.send(true);
  } catch (error) {
    console.log(error);
  }
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
