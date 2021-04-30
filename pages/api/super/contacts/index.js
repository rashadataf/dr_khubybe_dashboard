import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../../util/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const session = await getSession({ req: req });
      if (!session) {
        res.status(401).send({ message: "not authenticated!" });
        return;
      }
      const { client, db } = await connectToDatabase();
      const admins = db.collection("admins");
      const superEmail = session.user.email;
      const superAdmin = await admins.findOne({ email: superEmail });
      if (!superAdmin) {
        res.status(401).send({ message: "not authenticated!" });
        return;
      }
      if (superAdmin.role !== "super") {
        res.status(401).send({ message: "not authenticated!" });
        return;
      }

      const contacts = await db.collection("contacts").find({});
      const result = await contacts.toArray();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}
