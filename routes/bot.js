const TelegramBot = require("node-telegram-bot-api");
const Referral = require("../models/Referral");
const User = require("../models/User");
const Notification = require("../models/Notification");
const token = "7421425151:AAEGXwZkSO5MwPa4vVvBTtS8zM_uSBFfyZE";

// anomcoin.online
const serverurl = "https://15e8-185-12-142-237.ngrok-free.app";

let bot = null;
const botInit = () => {
  console.log("Start Telegram bot. Token:", token);
  bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
    try {
      const chatId = msg.chat.id;
      console.log(chatId);
      const referralCode = match[1];
      const webAppUrl = `${serverurl}?refer=${referralCode || ""}`;
      bot.sendMessage(chatId, "Open the web app with URL.", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "GoApp",
                web_app: {
                  url: webAppUrl,
                },
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.log(error);
    }
  });

  bot.on("callback_query", async (query) => {
    try {
      const chatId = query.message.chat.id;
      console.log(chatId);
      const {
        username = "",
        last_name = "",
        first_name = "",
      } = await bot.getChat(chatId);

      const webAppUrl = `${serverurl}?userId=${chatId}&username=${username}&name=${
        first_name + " " + last_name
      }&refer=`;

      bot.sendMessage(chatId, `Opening the web app with URL: ${webAppUrl}`);
    } catch (error) {
      console.log(error);
    }
  });
};

const sendMsgViaBot = (userId, message) => {
  const webAppUrl = `${serverurl}`;
  if (bot) {
    bot.sendMessage(userId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "GoApp",
              web_app: {
                url: webAppUrl,
              },
            },
          ],
        ],
      },
    });
  }
};

const sendReferNotification = async (userId, bonus, referrer) => {
  try {
    const tgmsg = `<b>${referrer.name}</b> accepts your invitation.
        <i>You get ${bonus} bonus $SELFIEs!</i>`;
    sendMsgViaBot(userId, tgmsg);
    const message = `<div class="flex flex-col"><div class="text-sm"><b>${referrer.name}</b> accepts your invitation.</div><div class="text-xs">You get ${bonus} bonus $SELFIEs!</div></div>`;
    await new Notification({
      userId,
      message,
    }).save();
  } catch (error) {
    console.log(error);
  }
};

const saveReferralCode = async (userId, referralCode, user) => {
  try {
    const referrer = await User.findOne({ chatId: referralCode });
    if (referrer) {
      const oldref = await Referral.findOne({
        code: referralCode,
        userId,
      });
      if (oldref) return null;
      const sendRef = await Referral.findOne({
        userId: referralCode,
        code: userId,
      });
      if (sendRef) return null;
      let bonus = 50;
      await new Referral({
        code: referralCode,
        sender: referrer._id,
        userId,
        receiver: user._id,
        bonus,
      }).save();
      sendReferNotification(referralCode, bonus, referrer);
      return null;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAvatar = async (chatId) => {
  try {
    let fileUrl = "";
    if (bot) {
      const photos = await bot.getUserProfilePhotos(chatId);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const file = await bot.getFile(fileId);
        fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      }
      return fileUrl;
    }
  } catch (error) {
    console.log(error);
  }
  return "";
};

const isValidBotUsername = async (username) => {
  try {
    console.log(username);
    const chat = await bot.getChat(username);
    console.log(chat.type);
    if (chat) return chat;
    return false;
  } catch (error) {
    return false;
  }
};

const BOT = () => bot;

module.exports = {
  sendMsgViaBot,
  saveReferralCode,
  token,
  getAvatar,
  botInit,
  isValidBotUsername,
  BOT,
  serverurl,
  sendReferNotification,
};
