const express = require("express");
const registerApi = require("./register");
const loginApi = require("./login");
const paymentApi = require("./payment");
const refreshApi = require("./refresh");
const router = express.Router();

router.use(registerApi);
router.use(loginApi);
router.use(paymentApi);
router.use(refreshApi);

module.exports = router;
