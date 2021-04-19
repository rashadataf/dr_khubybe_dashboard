import { connectToDatabase } from "../../../util/mongodb";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { client, db } = await connectToDatabase();
      const blogs = await db.collection("blogs").find({});
      const result = await blogs.toArray();
      for (let i = 0; i < result.length; i++) {
        const tags = result[i].tags;
        const references = result[i].references;
        const blogReferences = [];
        const blogTags = [];
        for (let j = 0; j < tags.length; j++) {
          const returnedTag = await db
            .collection("tags")
            .findOne({ _id: tags[j] });
          blogTags.push(returnedTag);
        }
        for (let y = 0; y < references.length; y++) {
          const returnedReference = await db
            .collection("references")
            .findOne({ _id: references[y] });
          blogReferences.push(returnedReference);
        }

        result[i].tags = blogTags;
        result[i].references = blogReferences;
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}

export default allowCors(handler);
