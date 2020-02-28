const express = require("express");
const router = express.Router();
const { check } = require("express-validator/check");
const authController = require("../controllers/authController");
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/signup", check("email").isEmail(), authController.postSignup);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
