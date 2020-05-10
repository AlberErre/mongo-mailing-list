import express from "express";
import rateLimit from "express-rate-limit";
import { check, validationResult } from "express-validator";
import bodyParser from "body-parser";
import cors from "cors";
import { Email } from "./models";
import { mongoConnect } from "./utils";
import "./lib/dotenv";

(async () => {
  // Connect mongoDB
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
    res.send("welcome to fakers.ai API!");
  });

  app.get("/email-listing/all", function (req, res) {
    Email.find((err, emails) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      }
      console.log("email-listing: ", emails);
      res.status(200).send(emails);
    });
  });

  const emailPostLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "You have added too many emails.",
  });

  app.post(
    "/mailing",
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
      console.log("new mail added: ", email);
      res.status(200).send("Email added to list.");
    }
  );

  app.listen(PORT, () => {
    console.log(`API ready on port ${PORT}.`);
  });
})();
