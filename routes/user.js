const express = require("express");
const User = require("../models/User");
const { saveReferralCode, getAvatar } = require("./bot");
const { generateRandomCode, transporter } = require("../helpers/func");
const { sendFaceUploadNotification } = require("../controllers/notification");

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
    res.json({ user, bonus });
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

router.post("/email", async (req, res) => {
  const { userId } = req.query;
  const { email } = req.body;
  const code = generateRandomCode();
  try {
    // if (process.env.mode === "prod") {
    //   await transporter.sendMail({
    //     from: `"selfieai" <MS_erP0vn@trial-z86org8wp1ngew13.mlsender.net>`,
    //     to: email,
    //     subject: "Selfie AI",
    //     text: `Your verification code is ${code}`,
    //     html: `<h1>Your verification code is <i>${code}</i></h1>`,
    //   });
    // }
    let user = await User.findOne({ chatId: userId });
    user.code = code;
    await user.save();
    res.json({ msg: "ok" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/confirmemail", async (req, res) => {
  const { userId } = req.query;
  const { email, code } = req.body;
  try {
    let user = await User.findOne({ chatId: userId });
    if (code !== user.code) {
      res.status(400).send({ message: "wrong code" });
      return;
    }
    user.code = "xxxx";
    user.email = email;
    await user.save();
    res.json({ msg: "ok" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/face", async (req, res) => {
  const { userId } = req.query;
  const { path } = req.body;
  try {
    let user = await User.findOne({ chatId: userId });
    user.face = path;
    user.point += 20;
    await user.save();
    sendFaceUploadNotification(userId, 20);
    res.json({ msg: "ok", point: user.point });
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
