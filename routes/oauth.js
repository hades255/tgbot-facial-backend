const express = require("express");

const router = express.Router();

router.get("/google-exchange-token", async (req, res) => {
  const { code } = req.query;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code,
      client_id: process.env.OAUTH2_GOOGLE_ID,
      client_secret: process.env.OAUTH2_GOOGLE_SECRET,
      redirect_uri: `${
        process.env.SERVER_URL || "http://localhost:3004"
      }/oauth/google-callback`,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenResponse.json();
  res.json(tokenData);
});

router.get("/google-callback", (req, res) => {
  const { code } = req.query;
  console.log(code);
  // Exchange the code for an access token
  // Send the token back to the client
});

router.get("/apple-exchange-token", async (req, res) => {
  const { code } = req.query;
  const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code,
      client_id: "YOUR_CLIENT_ID",
      client_secret: "YOUR_CLIENT_SECRET",
      redirect_uri: "http://localhost:3001/callback",
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenResponse.json();
  res.json(tokenData);
});

router.get("/apple-callback", (req, res) => {
  const { code } = req.query;
  console.log(code);
  // Exchange the code for an access token
  // Send the token back to the client
});

module.exports = router;
