const express = require("express");
const RefreshToken = require("../models/refresh");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Refresh Token Required" });
    }
    const isValidToken = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    const existingRefreshToken = await RefreshToken.findOne({ token });
    if (!existingRefreshToken || !isValidToken) {
      return res.status(400).json({
        message: "Refresh Token does not match!",
      });
    }
    await RefreshToken.findOneAndDelete({ token });
    // Get user info from the existing refresh token if needed
    const { id, email } = jwt.decode(token);
    // Generate new JWT and Refresh Tokens
    const jwtToken = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });
    const refresh_token = jwt.sign(
      { id, email },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );
    // Save the new Refresh Token to the database
    await RefreshToken.create({
      token: refresh_token,
      email,
    });
    res.json({ access_token: jwtToken, refresh_token });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error });
  }
});

module.exports = router;
