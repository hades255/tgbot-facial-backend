const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stakeSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: Number, default: 0 }, //  0-ptr 1-token
    end: { type: Date, required: true },
    profit: { type: Number, default: 0 },
    status: { type: Number, default: 0 }, //  0-request 1-processing  2-pending 3-completed 4-canceled
  },
  { timestamps: true }
);

const Stake = mongoose.model("Stake", stakeSchema);

module.exports = Stake;
