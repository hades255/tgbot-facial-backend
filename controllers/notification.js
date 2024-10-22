const Notification = require("../models/Notification");
const { sendMsgFromBot } = require("../routes/bot");

const USERS = [];

const updateUser = (userId) => {
  USERS[userId] = Date.now();
};

const getUser = (userId) => USERS[userId] || "0";

const sendReferNotification = async (userId, bonus, referrer) => {
  try {
    const message = `<div class="flex flex-col"><div class="text-sm"><b>${referrer.name}</b> accepts your invitation.</div><div class="text-xs">You get ${bonus} bonus $SELFIEs!</div></div>`;
    if (Date.now() - getUser(userId) > 60000) {
      sendMsgFromBot(userId, message);
    }
    await new Notification({
      userId,
      message,
    }).save();
  } catch (error) {
    console.log(error);
  }
};

const sendStakeNotification = async (userId, bonus, unit) => {
  try {
    const message = `<div class="text-sm"><b>You</b> get ${bonus} bonus ${unit}s from staking!</div>`;
    if (Date.now() - getUser(userId) > 60000) {
      sendMsgFromBot(userId, message);
    }
    await new Notification({
      userId,
      message,
    }).save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateUser, sendReferNotification, sendStakeNotification };
