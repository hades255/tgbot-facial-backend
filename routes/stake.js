const express = require("express");
const User = require("../models/User");
const Stake = require("../models/Stake");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.query;
  const { amount, end, unit, profit } = req.body;
  try {
    let user = await User.findOne({ chatId: userId });
    if (!user) {
      res.status(400).send({ message: "Invalid amount." });
      return;
    }
    if (unit) user.token -= amount;
    else user.point -= amount;
    await user.save();
    await new Stake({
      user,
      userId,
      amount,
      end,
      unit,
      profit,
    }).save();
    res.status(200).send({
      point: user.point,
      token: user.token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const { userId, max } = req.query;
  try {
    const stakes = await Stake.find({ userId })
      .sort({ status: 1, end: 1 })
      .limit(max);
    res.status(200).send({ stakes });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/cancel", async (req, res) => {
  const { id } = req.body;
  try {
    const stake = await Stake.findById(id);
    stake.status = 4;
    await stake.save();
    const user = await User.findOne({ chatId: stake.userId });
    if (stake.unit) user.token += stake.amount;
    else user.point += stake.amount;
    await user.save();
    res.status(200).send({
      point: user.point,
      token: user.token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
