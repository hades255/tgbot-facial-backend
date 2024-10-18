const express = require("express");
const User = require("../models/User");
const { saveReferralCode, checkBonusStatus, getAvatar } = require("./bot");
const { getTask } = require("../helpers/task");
const { getCoin, updateCoin } = require("../helpers/coin");
const { getProfile } = require("../controllers/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId, name, username, refer } = req.query;
  console.log(req.query);
  try {
    let user = await User.findOne({ chatId: userId });
    const avatar = await getAvatar(userId);
    let bonus = 0;
    let updateFlag = false;
    if (refer && refer !== userId) {
      bonus = await saveReferralCode(userId, refer, user);
    }
    if (user) {
      bonus = await checkBonusStatus(userId);
      if (user.name !== name) {
        user.name = name;
        updateFlag = true;
      }
      if (user.username !== username) {
        user.username = username;
        updateFlag = true;
      }
      if (user.avatar !== avatar) {
        user.avatar = avatar;
        updateFlag = true;
      }
      if (bonus) {
        user.point += bonus;
        user.totalPoint += bonus;
        user.dailyPoint += bonus;
        user.weeklyPoint += bonus;
        updateFlag = true;
      }
      if (updateFlag) await user.save();
    } else {
      user = await new User({
        chatId: userId,
        name,
        username,
        avatar,
        point: bonus || 0,
      }).save();
    }
    const task = getTask(userId.toString());
    const coin = getCoin(userId.toString(), user.boost);
    res.json({
      point: user.point,
      user,
      task,
      otTasks: user.tasks,
      coin,
      bonus,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/avatar", async (req, res) => {
  const { userId } = req.query;
  try {
    const data = await getAvatar(userId);
    res.json({ msg: "ok", data });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    //  chatId: { $ne: userId }
    const users = await User.find({})
      .sort({
        point: -1,
      })
      .limit(100);
    const count = await User.countDocuments();
    res.json({ msg: "ok", data: users, count });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
