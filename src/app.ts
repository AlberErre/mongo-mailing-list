import express from "express";
import { check, validationResult } from "express-validator";
import bodyParser from "body-parser";
import cors from "cors";
import { Email } from "./models";
import { mongoConnect, emailPostLimiter } from "./utils";
import "./lib/dotenv";

(async () => {
  // Connect to mongoDB
  const url = process.env.MONGO_URL;
  await mongoConnect(url);

  // Express API
  const PORT = 3001;
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.get("/", function (req, res) {
    res.send("welcome to your mailing API!");
  });

  app.get("/email/listing", function (req, res) {
    Email.find((err, emails) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      }
      res.status(200).send(emails);
    });
  });

  app.post(
    "/email/add",
    [check("email").isEmail()],
    emailPostLimiter,
    async (req, res) => {
      // Finds the validation errors in this request and wraps them in an object
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // save email in mongo
      let email = req.body.email;
      let newEmail = new Email({
        email,
        timestamp: new Date(),
      });
      await newEmail.save((err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        }
      });
      res.status(200).send("Email added to list.");
    }
  );

  app.listen(PORT, () => {
    console.log(`API ready on port ${PORT}.`);
  });
})();
