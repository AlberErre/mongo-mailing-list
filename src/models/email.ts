import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  email: String,
  timestamp: { type: Date, default: Date.now },
});

const Email = mongoose.model("Email", emailSchema);

export default Email;
