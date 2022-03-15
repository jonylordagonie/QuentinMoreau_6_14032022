const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const likeCtrl = require ("../controllers/like") 
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, sauceCtrl.sauceCreate);
router.get("/:id", auth, sauceCtrl.sauceDisplayOne);
router.put("/:id", auth, multer, sauceCtrl.sauceModif);
router.delete("/:id", auth, sauceCtrl.sauceDelete);
router.get("/", auth, sauceCtrl.sauceDisplayAll);
router.post("/:id/like", auth, likeCtrl.sauceLike)

module.exports = router;
