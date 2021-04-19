import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../../util/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET" || req.method === "get") {
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
      const references = db.collection("references").find({});
      const result = await references.toArray();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  } else if (req.method === "POST" || req.method === "post") {
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
      const result = db.collection("references").insertOne(req.body);
      res.send(true);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}
