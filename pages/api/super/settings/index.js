import mongodb from "mongodb";
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

      const settings = await db.collection("settings").find({});
      const result = await settings.toArray();
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
      const apiKey = req.body.apiKey;
      const listID = req.body.listID;
      const server = req.body.server;

      if (apiKey.length === 0 || listID.length === 0) {
        res.status(400).send({ message: "invalid value!" });
        return;
      }

      const settings = db.collection("settings");
      const oldSettings = await settings.find({}).toArray();
      if (oldSettings.length > 0) {
        await settings.updateOne(
          { _id: new mongodb.ObjectID(oldSettings[0]._id) },
          {
            $set: { apiKey, listID, server },
          }
        );
      } else {
        await settings.insertOne({
          apiKey,
          listID,
          server,
        });
      }
      res.send(true);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}
