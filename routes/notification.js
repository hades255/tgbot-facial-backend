const express = require("express");
const Notification = require("../models/Notification");
const { sendReferNotification } = require("./bot");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.query;
  try {
    await sendReferNotification(userId, 50, { name: "Smart Guy" });
    const message = `<b>$Smart Guy</b> accepts your invitation.
        <i>You get 50 bonus $SELFIEs!</i>`;
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
