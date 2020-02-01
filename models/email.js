const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: String,
  timestamp: { type: Date, default: Date.now }
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
