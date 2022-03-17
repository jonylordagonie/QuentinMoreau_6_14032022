const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const likeCtrl = require("../controllers/like");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const limiterCtrl = require("../middleware/limiter");

router.post("/", auth, limiterCtrl.sauceLimiter, multer, sauceCtrl.sauceCreate);
router.get("/:id", auth, sauceCtrl.sauceDisplayOne);
router.put("/:id", auth, limiterCtrl.sauceLimiter, multer, sauceCtrl.sauceModif);
router.delete("/:id", auth, limiterCtrl.sauceLimiter, sauceCtrl.sauceDelete);
router.get("/", auth, sauceCtrl.sauceDisplayAll);
router.post("/:id/like", auth, limiterCtrl.likeLimiter, likeCtrl.sauceLike);

module.exports = router;
