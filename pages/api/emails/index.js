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
        const emails = db.collection("emails");
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
        let isEmailInDB = await emails.findOne({ email: email });
        if (isEmailInDB) {
          throw new Error("email already exist's!");
        }
        const settings = await db.collection("settings").find({}).toArray();
        if (settings.length > 0) {
          const result = await emails.insertOne({ email: email });
          const { apiKey, listID, server } = settings[0];
          console.log(server);
          const subscribingUser = {
            email: email,
          };
          const mailchimp = require("@mailchimp/mailchimp_marketing");
          mailchimp.setConfig({
            apiKey: apiKey,
            server: server,
          });
          const response = await mailchimp.lists.addListMember(listID, {
            email_address: subscribingUser.email,
            status: "subscribed",
          });
          if (response.id) {
            return res.status(200).send(true);
          }
        } else {
          throw new Error("there is no settings in database!!");
        }
        res.status(200).send(true);
      } catch (error) {
        res.status(400).send({ error: "there was an error happened!" });
      }
    }
  }
}

export default allowCors(handler);
