const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Email } = require("./models");
dotenv.config();

const url = process.env.MONGO_URL;
const mongoConnect = url => {
  mongoose.connect(url, { useNewUrlParser: true });
  return mongoose.connection;
};

const client = mongoConnect(url);
client.on("error", console.error.bind(console, "connection error:"));
client.once("open", function() {
  console.log("connected!");
  //console.log("client", client);
});

// create new item
let newEmail = new Email({
  email: "test@fakers.ai",
  timestamp: new Date()
});

//save item
newEmail.save((err, result) => {
  if (err) return console.error(err);
});

//return all items in collection

// Email.find((err, emails) => {
//   if (err) return console.error(err);
//   console.log(emails);
// });
