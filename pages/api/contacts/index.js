import { connectToDatabase } from "../../../util/mongodb";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return await fn(req, res);
};

async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).send(true);
  } else {
    if (req.method === "POST") {
      try {
        const { client, db } = await connectToDatabase();
        const contacts = db.collection("contacts");
        const name = req.body.name;
        const phone = req.body.phone;
        const subject = req.body.subject;
        const message = req.body.message;
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
        const result = await contacts.insertOne({
          name,
          phone,
          subject,
          message,
          email,
        });
        res.status(200).send(true);
      } catch (error) {
        res.status(400).send({ error: "there was an error happened!" });
      }
    }
  }
}

export default allowCors(handler);
