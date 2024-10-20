const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  chatId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, default: "" },
  email: { type: String, default: "" },
  avatar: { type: String, default: "" },
  face: { type: String, default: "" },
  point: { type: Number, default: 0 },
  token: { type: Number, default: 0 },
  code: { type: String, default: "xxxx" },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
