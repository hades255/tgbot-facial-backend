const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "YOUR_REGION",
});

const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

module.exports = { rekognition, s3 };
