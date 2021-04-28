import { getSession } from "next-auth/client";
import mongodb from "mongodb";
import { connectToDatabase } from "../../../../util/mongodb";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  switch (method) {
    case "GET":
      // Get data from your database
      res.status(200).json({ id, name: `User ${id}` });
      break;
    case "DELETE":
      {
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
          const deleteResult = await db
            .collection("emails")
            .deleteOne({ _id: new mongodb.ObjectID(id) });

          res.status(200).json({ success: "deleted!" });
        } catch (error) {
          res.status(400).send({ message: error });
        }
      }
      break;
  }
}
