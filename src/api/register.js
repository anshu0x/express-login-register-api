const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.json({ message: "Please fill all the fields" });
    }

    const alreadyExistsUser = await User.findOne({ email }).catch((err) => {
      console.log("Error: ", err);
    });

    if (alreadyExistsUser) {
      return res.status(409).json({ message: "User with email already exists!" });
    }

    const newUser = new User({ fullName, email, password });
    const savedUser = await newUser.save().catch((err) => {
      console.log("Error: ", err);
      res.status(500).json({ error: "Cannot register user at the moment!" });
    });

    if (savedUser) res.json({ message: "Thanks for registering" });
  } catch (error) {
    res.status(500).json({ error: "Cannot register user at the moment!" });
  }
});

module.exports = router;
