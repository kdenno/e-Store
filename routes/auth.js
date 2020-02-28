const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator/check");
const authController = require("../controllers/authController");
const User = require("../models/user");
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email")
      .custom((value, { req }) => {
        User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            // user exists, reject it
            return Promise.reject(
              "Email exists already, Please choose a different email"
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a value with only numbers and text and atleast 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    })
  ],
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
