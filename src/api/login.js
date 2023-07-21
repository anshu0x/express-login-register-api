const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
      return res.status(400).json({ message: "Email or password does not match!" });
    }

    if (userWithEmail.password !== password) {
      return res.status(400).json({ message: "Email or password does not match!" });
    }

    const jwtToken = jwt.sign(
      { id: userWithEmail.id, email: userWithEmail.email },
      process.env.JWT_SECRET
    );

    res.json({ message: "Welcome Back!", token: jwtToken });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error });
  }
});

module.exports = router;
