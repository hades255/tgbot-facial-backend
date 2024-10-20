const express = require("express");
const User = require("../models/User");
const Convert = require("../models/Convert");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.query;
  const { input, profit } = req.body;
  try {
    let user = await User.findOne({ chatId: userId });
    if (!user || user.point < input) {
      res.status(400).send({ message: "Invalid amount." });
      return;
    }
    user.point += input * profit - input;
    user.token += input / 100;
    await user.save();
    await new Convert({
      user,
      userId,
      amount: input,
      unitFrom: 0,
      unitTo: 1,
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
    const converts = await Convert.find({ userId }).limit(max);
    res.status(200).send({ converts });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
