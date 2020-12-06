const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.get("/logout", userCtrl.logout);

router.get("/", userCtrl.getAllUsers);

router.get("/infor", auth, userCtrl.getUser);
router.patch("/addCart", auth, userCtrl.addCart);

router.get("/refresh_token", userCtrl.refreshToken);

module.exports = router;
