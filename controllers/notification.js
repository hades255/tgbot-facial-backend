const Notification = require("../models/Notification");
const { sendMsgViaBot } = require("../routes/bot");

const sendStakeNotification = async (userId, bonus, unit) => {
  try {
    const tgmsg = `<b>You</b> get ${bonus} bonus ${unit}s from staking!`;
    sendMsgViaBot(userId, tgmsg);
    const message = `<div class="text-sm"><b>You</b> get ${bonus} bonus ${unit}s from staking!</div>`;
    await new Notification({
      userId,
      message,
    }).save();
  } catch (error) {
    console.log(error);
  }
};

const sendFaceUploadNotification = async (userId, bonus) => {
  try {
    const tgmsg = `<b>You</b> get ${bonus} bonus $SELFIEs from Face Uploading!`;
    sendMsgViaBot(userId, tgmsg);
    const message = `<div class="text-sm"><b>You</b> get ${bonus} $SELFIEs from</div><div>Face Uploading!</div>`;
    await new Notification({
      userId,
      message,
    }).save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendStakeNotification, sendFaceUploadNotification };
