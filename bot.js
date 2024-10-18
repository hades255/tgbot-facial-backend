const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const userRouter = require("./routes/user");
const faceRouter = require("./routes/face");
const referralRouter = require("./routes/referral");
const { botInit } = require("./routes/bot");

//  todo
const dbURI =
  // "mongodb+srv://chaolongpiao:chaolong1995@cluster0.inglvcw.mongodb.net/tg_bot_facial";
  "mongodb://127.0.0.1:27017/facial";
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(morgan("combined"));

app.use((req, res, next) => {
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes
  next();
});

app.use("/user", userRouter);
app.use("/face", faceRouter);
app.use("/referral", referralRouter);

app.use(express.static(path.join(__dirname, "../tgbot-facial-frontend/build")));

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../tgbot-facial-frontend/build", "index.html")
  );
});

app.get("/battle", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../tgbot-facial-frontend/build", "index.html")
  );
});

const port = process.env.PORT || 3006;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  //  todo
  // botInit();
});
