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

      const emails = await db.collection("emails").find({});
      const result = await emails.toArray();
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
      const subject = req.body.subject;
      const content = req.body.content;

      const emails = await db.collection("emails").find({}).toArray();
      if (emails.length === 0) {
        res
          .status(400)
          .send({ message: "There are no subscribers to send them an email!" });
        return;
      }

      let to = "";
      for (let i = 0; i < emails.length; i++) {
        to = to + emails[i].email;
        if (i !== emails.length - 1) to = to + ", ";
      }

      let nodemailer = require("nodemailer");

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "rashadtest993@gmail.com",
          pass: "Rashadattaf1993",
        },
      });
      let mailOptions = {
        from: "rashadtest993@gmail.com",
        to: to,
        subject: subject,
        html: content,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(400).send(error);
          return;
        }
      });
      res.send(true);
    } catch (error) {
      res.status(400).send({ error: "there was an error happened!" });
    }
  }
}
