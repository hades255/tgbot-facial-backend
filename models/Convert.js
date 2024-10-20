const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const convertSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    unitFrom: { type: Number, default: 0 }, //  0-ptr 1-token
    unitTo: { type: Number, default: 0 }, //  0-ptr 1-token
    profit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Convert = mongoose.model("Convert", convertSchema);

module.exports = Convert;
