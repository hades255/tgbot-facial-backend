const Stake = require("../models/Stake");
const User = require("../models/User");

const dailyStakeUpdater = async () => {
  try {
    await Stake.updateMany({ status: 0 }, { status: 1 });
    const processingStakes = await Stake.find({ status: 1 });
    const today = new Date().toISOString().split("T")[0];
    processingStakes.forEach((stake) => {
      if (today == new Date(stake.end).toISOString().split("T")[0]) {
        Stake.updateOne({ _id: stake._id }, { status: 2 });
        User.updateOne(
          { chatId: stake.userId },
          {
            $inc: {
              [stake.unit ? "token" : "point"]:
                stake.amount * (1 + stake.profit),
            },
          },
          { new: true }
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { dailyStakeUpdater };
