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
    case "PUT":
      {
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
        const updates = Object.keys(req.body);
        const allowedUpdates = ["title"];
        const isValidOperation = updates.every((update) =>
          allowedUpdates.includes(update)
        );
        if (!isValidOperation) {
          res.status(404).send({ error: "an Invalid Update" });
        }
        try {
          const result = await db
            .collection("references")
            .updateOne(
              { _id: new mongodb.ObjectID(id) },
              { $set: { title: req.body.title } }
            );
          res.status(200).json({ success: "updated!" });
        } catch (error) {
          res.status(400).send(error);
        }
      }
      break;
    case "DELETE":
      {
        try {
          const session = await getSession({ req: req });
          console.log("delete");
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
          const deleteResult = await db
            .collection("references")
            .deleteOne({ _id: new mongodb.ObjectID(id) });

          await db
            .collection("blogs")
            .update(
              {},
              { $pull: { references: new mongodb.ObjectID(id) } },
              { multi: true }
            );
          res.status(200).json({ success: "deleted!" });
        } catch (error) {
          res.status(400).send({ message: error });
        }
      }
      break;
  }
}
