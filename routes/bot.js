const TelegramBot = require("node-telegram-bot-api");
const Referral = require("../models/Referral");
const User = require("../models/User");
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

const saveReferralCode = async (userId, referralCode, user) => {
  try {
    const referrer = await User.findOne({ chatId: referralCode });
    if (referrer) {
      const oldref = await Referral.findOne({
        code: referralCode,
        userId,
      });
      if (oldref) return null;
      let bonuscase = true;
      let bonuscase5k = false;
      const sendRef = await Referral.findOne({
        userId: referralCode,
        code: userId,
      });
      if (sendRef) return null; //bonuscase = false;
      if (bonuscase) {
        const oldrefCounts = await Referral.countDocuments({
          code: referralCode,
        });
        if (oldrefCounts < 5) bonuscase5k = true;
      }
      let bonus = 0;
      if (bonuscase) {
        const point = user ? user.point : 0;
        bonus =
          (bonuscase5k ? 5000 : 0) +
          (point > 100000 ? 10000 : Math.round(point / 10));
      }
      await new Referral({
        code: referralCode,
        sender: referrer._id,
        userId,
        receiver: user._id,
        bonus,
        status: bonuscase5k,
      }).save();
      return null;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkBonusStatus = async (userId) => {
  try {
    const refers = await Referral.find({ code: userId });

    let newBonus = 0;
    for (i = 0; i < refers.length; i++) {
      const refer = refers[i];
      const referrer = await User.findOne({ chatId: refer.userId });
      if (referrer) {
        const bonus =
          (refer.status ? 5000 : 0) +
          (referrer.point > 100000 ? 10000 : Math.round(referrer.point / 10));
        const diff = bonus - (refer.read ? refer.bonus : 0);
        newBonus += diff > 0 ? diff : 0;
        await Referral.updateOne(
          { code: userId, userId: refer.userId },
          { bonus, read: true }
        );
      }
    }
    return newBonus;
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

module.exports = {
  saveReferralCode,
  checkBonusStatus,
  token,
  getAvatar,
  botInit,
  isValidBotUsername,
};
