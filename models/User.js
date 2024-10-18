const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  chatId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, default: "" },
  avatar: { type: String, default: "" },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
