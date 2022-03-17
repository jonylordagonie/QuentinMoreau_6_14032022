const express = require("express");
const router = express.Router();

const limiterCtrl = require("../middleware/limiter")
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", limiterCtrl.passwordLimiter, userCtrl.login);

module.exports = router;
