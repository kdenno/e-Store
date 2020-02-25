const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(result => {
      if (result) {
        req.flash("error", "Email already exists, please pick a different one");
        // user exists
        return res.redirect("/signup");
      }
      // encrypt password
      return bcrypt
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
