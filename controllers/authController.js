const express = require("express");
const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  // const loggedIn = req
  //   .get("Cookie")
  //   .split(";")[1]
  //   .trim()
  //   .split("=")[1];
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false
  });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  // process login and return cookie to user
  // res.setHeader("Set-Cookie", "loggedIn = true");
  // note the express-session package adds the session object to every request so we can use that object and add custom properites
  // create middleware for user
  User.findById("5e4fc09d7f3ac60327e0d300")
    .then(user => {
      req.session.isAuthenticated = true;
      req.session.theuser = user; // remember setting the user on the session is sharing the user accross all requests
      req.session.save(err => {
        // we can harness the session.save() and give it a callback to call after updating our session to the database to avoid redirecting too soon
        console.log(err);
        res.redirect("/");
      });
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
        // user exists
        return res.redirect("/signup");
      }
      // create user
      const user = new User({
        email: email,
        password: password,
        card: { item: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
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
