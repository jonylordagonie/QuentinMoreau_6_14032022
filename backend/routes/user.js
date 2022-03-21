// On require express et un router
const express = require("express");
const router = express.Router();

// On require nos middleware et contrillers utiliser pour nos routes
const limiterCtrl = require("../middleware/limiter")
const userCtrl = require("../controllers/user");

// On defini la route secondaire et appelon nos middleware et contronlers
router.post("/signup", userCtrl.signup);
router.post("/login", limiterCtrl.passwordLimiter, userCtrl.login);

// On export
module.exports = router;
