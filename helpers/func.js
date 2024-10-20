const dateDiffInSeconds = (date1, date2) =>
  Math.abs(date1.getTime() - date2.getTime()) / 1000;

const dateDiffInHours = (date1, date2) =>
  Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60);

const dateDiffInMins = (date1, date2) =>
  Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60);

const getLastSegment = (input) => {
  const segments = input.split(/[\\/]/);
  return segments.pop();
};

const generateRandomCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

module.exports = {
  dateDiffInSeconds,
  dateDiffInHours,
  dateDiffInMins,
  getLastSegment,
  generateRandomCode,
};
