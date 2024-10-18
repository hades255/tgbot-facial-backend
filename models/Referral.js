const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referralSchema = new Schema(
  {
    code: { type: String, required: true }, //  sender
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: String, required: true }, //  receiver
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bonus: { type: Number, default: 0 },
    status: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;
