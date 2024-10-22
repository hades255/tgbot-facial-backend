const express = require("express");
const { updateUser } = require("../controllers/notification");
const Notification = require("../models/Notification");
const { sendMsgFromBot } = require("./bot");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const message = `<div class="flex flex-col"><div class="text-sm"><b>Smart Guy</b> accepts your invitation.</div><div class="text-xs">You get 5000 bonus $SELFIEs!</div></div>`;
    sendMsgFromBot(userId, message);
    await new Notification({
      userId,
      message,
    }).save();
    res.status(200).send({});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const notifications = await Notification.find({ userId }).sort({
      status: 1,
    });
    res.status(200).send(notifications);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/check", async (req, res) => {
  const { userId } = req.query;
  try {
    updateUser(userId);
    const notifications = await Notification.find({ userId, status: 0 });
    res.status(200).send(notifications);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/check", async (req, res) => {
  const { id } = req.body;
  try {
    await Notification.updateOne({ _id: id }, { status: 1 });
    res.status(200).send({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
