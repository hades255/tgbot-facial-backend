const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Number, default: 0 }, //  0-unread  1-read
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
