// On require express et un router
const express = require("express");
const router = express.Router();

// On require nos middleware et contrillers utiliser pour nos routes
const sauceCtrl = require("../controllers/sauce");
const likeCtrl = require("../controllers/like");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const limiterCtrl = require("../middleware/limiter");

// On defini la route secondaire et appelon nos middleware et contronlers
router.post("/", auth, multer, limiterCtrl.sauceLimiter, sauceCtrl.sauceCreate);
router.get("/:id", auth, sauceCtrl.sauceDisplayOne);
router.put("/:id", auth, multer,  limiterCtrl.sauceLimiter, sauceCtrl.sauceModif);
router.delete("/:id", auth, limiterCtrl.sauceLimiter, sauceCtrl.sauceDelete);
router.get("/", auth, sauceCtrl.sauceDisplayAll);
router.post("/:id/like", auth, limiterCtrl.likeLimiter, likeCtrl.sauceLike);

// On export
module.exports = router;
