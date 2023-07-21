const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refresh");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("pass", password, email);
    if (!email || !password) {
      return res.json({ message: "Please fill all the fields" });
    }

    const userWithEmail = await User.findOne({ email });
    console.log(userWithEmail, "userWithEmail");
    if (!userWithEmail) {
      return res
        .status(400)
        .json({ message: "Email or password does not match!" });
    }

    if (userWithEmail.password !== password) {
      return res
        .status(400)
        .json({ message: "Email or password does not match!" });
    }

    // Check if there's an existing refresh token for the user
    const existingToken = await RefreshToken.findOneAndDelete({ email });
    console.log(existingToken, "existingToken");
    const jwtToken = jwt.sign(
      { id: userWithEmail.id, email: userWithEmail.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );
    const refresh_token = jwt.sign(
      { id: userWithEmail.id, email: userWithEmail.email },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );
    const userToken = await RefreshToken.create({
      email,
      token: refresh_token,
    });
    console.log(userToken, "userToken");
    res.json({ access_token: jwtToken, refresh_token });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error });
  }
});

module.exports = router;
