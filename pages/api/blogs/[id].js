import mongodb from "mongodb";
import { connectToDatabase } from "../../../util/mongodb";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === "GET" || req.method === "get") {
    try {
      const {
        query: { id },
      } = req;
      const { client, db } = await connectToDatabase();
      const blog = await db
        .collection("blogs")
        .findOne({ _id: new mongodb.ObjectID(id) });
      const tags = blog.tags;
      const references = blog.references;
      const blogReferences = [];
      const blogTags = [];
      for (let i = 0; i < tags.length; i++) {
        const returnedTag = await db
          .collection("tags")
          .findOne({ _id: tags[i] });
        blogTags.push(returnedTag.title);
      }
      for (let i = 0; i < references.length; i++) {
        const returnedReference = await db
          .collection("references")
          .findOne({ _id: references[i] });
        blogReferences.push(returnedReference.title);
      }
      blog.tags = blogTags;
      blog.references = blogReferences;
      res.status(200).send(blog);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}

export default allowCors(handler);