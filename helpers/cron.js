const cron = require("node-cron");
const { dailyStakeUpdater } = require("../controllers/stake");

/**
 * Daily cron job
 */
const updateDailyChecks = async () => {
  try {
    console.log("daily cron function called");
    await dailyStakeUpdater();
  } catch (error) {
    console.log(error);
  }
};

const onCronStarter = () => {
  console.log("cron function started");
  cron.schedule("0 0 * * *", updateDailyChecks, {
    scheduled: true,
    timezone: "EST",
  });
};

module.exports = { onCronStarter };
