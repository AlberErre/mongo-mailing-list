const express = require("express");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Email } = require("./models");
dotenv.config();

// Mongo DB
const url = process.env.MONGO_URL;
const mongoConnect = url => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("connected to database!"))
    .catch(err => {
      console.log(
        "An error ocurred while trying to connect to database: ",
        err.message
      );
    });
  return mongoose.connection;
};

const client = mongoConnect(url);
//client.on("error", console.error.bind(console, "connection error:"));
// client.once("open", function() {
//   console.log("connected!");
// });

// Express API
const PORT = 3001;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", function(req, res) {
  res.send("welcome to fakers.ai API!");
});

app.get("/email-listing/all", function(req, res) {
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
  message: "You have added too many emails."
});

app.post("/mailing", emailPostLimiter, async (req, res) => {
  let email = req.body.email;
  let newEmail = new Email({
    email,
    timestamp: new Date()
  });
  await newEmail.save((err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });
  console.log("new mail added: ", email);
  res.status(200).send("Email added to list.");
});

app.listen(PORT, () => {
  console.log(`API ready on port ${PORT}.`);
});
