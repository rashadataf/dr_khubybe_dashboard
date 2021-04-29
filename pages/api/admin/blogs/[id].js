import { getSession } from "next-auth/client";
import mongodb from "mongodb";
import { connectToDatabase } from "../../../../util/mongodb";
import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";

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

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};

apiRoute.get(async (req, res) => {
  try {
    const { client, db } = await connectToDatabase();
    const blogs = db.collection("blogs").find({});
    const result = await blogs.toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: "there was an error happened!" });
  }
});

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
    const adminEmail = session.user.email;
    const { client, db } = await connectToDatabase();
    const admins = db.collection("admins");
    const admin = await admins.findOne({ email: adminEmail });
    if (!admin) {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
    if (admin.role !== "super" && admin.role !== "admin") {
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
    const blogs = db.collection("blogs");
    const updatedBlog = await blogs.findOne({ _id: new mongodb.ObjectID(id) });
    if (updatedBlog.imageUrl) {
      if (imageUrl) {
        if (imageUrl !== updatedBlog.imageUrl) {
          fs.unlinkSync(path.join(process.cwd(), updatedBlog.imageUrl));
        }
      } else {
        fs.unlinkSync(path.join(process.cwd(), updatedBlog.imageUrl));
      }
    }
    const tags = JSON.parse(req.body.tags);
    const blogTags = [];
    if (tags)
      for (let i = 0; i < tags.length; i++) {
        const tagsCollection = db.collection("tags");
        const tag = await tagsCollection.findOne({ title: tags[i] });
        if (!tag) {
          const newTag = { title: tags[i] };
          const result = await tagsCollection.insertOne(newTag);
          blogTags.push(newTag._id);
        } else blogTags.push(tag._id);
      }

    const references = JSON.parse(req.body.references);
    const blogReferences = [];
    if (references)
      for (let i = 0; i < references.length; i++) {
        const referencesCollection = db.collection("references");
        const tag = await referencesCollection.findOne({
          title: references[i],
        });
        if (!tag) {
          const newTag = { title: references[i] };
          const result = await referencesCollection.insertOne(newTag);
          blogReferences.push(newTag._id);
        } else blogReferences.push(tag._id);
      }

    let title = req.body.title;
    let description = req.body.description;
    const result = await blogs.updateOne(
      { _id: new mongodb.ObjectID(id) },
      {
        $set: {
          title,
          description,
          imageUrl,
          references: blogReferences,
          tags: blogTags,
          updatedAt: new Date(),
        },
      }
    );
    res.send(true);
  } catch (error) {}
});

apiRoute.delete(async (req, res) => {
  const {
    query: { id },
  } = req;
  try {
    const { client, db } = await connectToDatabase();
    const deletedBlog = await db
      .collection("blogs")
      .findOneAndDelete({ _id: new mongodb.ObjectID(id) });
    let image = deletedBlog.value.imageUrl;
    if (image && image !== "null") {
      fs.unlinkSync(path.join(process.cwd(), image));
    }
    res.send(true);
  } catch (error) {
    console.log(error);
  }
});
