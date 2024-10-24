const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "public/uploads/" });
const {
  RekognitionClient,
  DetectFacesCommand,
} = require("@aws-sdk/client-rekognition");

const verifyImage = async (filePath) => {
  const image = fs.readFileSync(filePath);
  const rekognitionClient = new RekognitionClient({ region: "us-east-1" });

  const params = {
    Image: {
      Bytes: image,
    },
  };

  try {
    const response = await rekognitionClient.send(
      new DetectFacesCommand(params)
    );
    return response.FaceDetails;
  } catch (error) {
    console.error(error);
    return false;
  }
};
/*
router.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  const filePath = file.path;
  const fileName = file.filename;

  try {
    // Upload image to S3
    const s3Params = {
      Bucket: "YOUR_BUCKET_NAME",
      Key: fileName,
      Body: fs.createReadStream(filePath),
      ContentType: file.mimetype,
    };
    await s3.upload(s3Params).promise();

    // Use Rekognition to detect faces
    const rekognitionParams = {
      Image: {
        S3Object: {
          Bucket: "YOUR_BUCKET_NAME",
          Name: fileName,
        },
      },
    };
    const response = await rekognition.detectFaces(rekognitionParams).promise();
    const faceDetails = response.FaceDetails;

    if (faceDetails.length > 0) {
      res
        .status(200)
        .send({ message: "Image verified successfully", faceDetails });
    } else {
      res.status(400).send({ message: "Invalid image, no face detected" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  } finally {
    // Clean up uploaded file
    fs.unlinkSync(filePath);
  }
});
*/
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    res.status(200).send({ message: "Image uploaded successfully", file });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/verify", async (req, res) => {
  const { path } = req.query;
  try {
    const FaceDetails = await verifyImage(path);
    if (FaceDetails.length) {
      res
        .status(200)
        .send({ message: "Image verified successfully", FaceDetails:FaceDetails[0] });
    } else {
      res.status(400).send({ message: "Invalid image, no face detected" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
