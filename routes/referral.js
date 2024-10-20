const express = require("express");
const User = require("../models/User");
const Referral = require("../models/Referral");

const router = express.Router();

router.get("/frens", async (req, res) => {
  const { userId } = req.query;
  try {
    const frens = await Referral.find({ code: userId }).populate("receiver");
    res.json({ msg: "ok", frens });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus", async (req, res) => {
  const { userId } = req.query;
  try {
    const result = await Referral.aggregate([
      {
        $match: { code: userId, read: true },
      },
      {
        $group: {
          _id: null,
          totalBonus: { $sum: { $toDouble: "$bonus" } },
        },
      },
    ]);

    const totalBonus = result.length > 0 ? result[0].totalBonus : 0;
    res.json({ msg: "ok", totalBonus });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
