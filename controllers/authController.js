const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check"); // collect all errors that .isEmail collected

const transporter = nodemailer.createTransport({
  auth: {
    api_key:
      "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"
  }
});
exports.getLogin = (req, res, next) => {
  // const loggedIn = req
  //   .get("Cookie")
  //   .split(";")[1]
  //   .trim()
  //   .split("=")[1];
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message
  });
};
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  // process login and return cookie to user
  // res.setHeader("Set-Cookie", "loggedIn = true");
  // note the express-session package adds the session object to every request so we can use that object and add custom properites
  // create middleware for user
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // attach error message to session
        req.flash("error", "Invalid username or password");
        return res.redirect("/login");
      }
      // compare passwords
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isAuthenticated = true;
            req.session.theuser = user; // remember setting the user on the session is sharing the user accross all requests
            return req.session.save(err => {
              // we can harness the session.save() and give it a callback to call after updating our session to the database to avoid redirecting too soon
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid username or password");
          res.redirect("/login");
        })
        .catch(err => {});
    })
    .catch(err => console.log(err));
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(442).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg
    });
  }
  // encrypt password
  bcrypt
    .hash(password, 12)
    .then(hashedpassword => {
      // create user
      const user = new User({
        email: email,
        password: hashedpassword,
        card: { item: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
      // send email
      return transporter.sendMail({
        to: email,
        from: "support@ncarrierug.com",
        html: "<h1>SignUp is Successful</h1>"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    // find user we are trying to reset for
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          res.flash("error", "No Account was found with such email");
          res.redirect("/reset");
        }
        // attach token to user
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000;
        // update user
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        // send reset link to user
        return transporter.sendMail({
          to: req.body.email,
          from: "support@ncarrierug.com",
          html: `<p> You requested for a password reset</p>
        <p>Please click this <a href="localhost:8000/reset/${token}">link</a> to reset your password</p>`
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
exports.getNewPassword = (req, res, next) => {
  const thetoken = req.params.token;
  User.findOne({ resetToken: thetoken, resetTokenExpiry: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/newpassword",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postNewPassword = (req, res, next) => {
  const resetPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiry: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(resetPassword, 12);
    })
    .then(hashedpassword => {
      resetUser.password = hashedpassword;
      resetUser.resetTokenExpiry = undefined;
      resetUser.resetToken = undefined;
      // save user
      return resetUser.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    });
};
