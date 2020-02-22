const express = require("express");
exports.getLogin = (req, res, next) => {
  // const loggedIn = req
  //   .get("Cookie")
  //   .split(";")[1]
  //   .trim()
  //   .split("=")[1];
  console.log(req.session.isAuthenticated);
  res.render("auth/login", { 
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: true
  });
};

exports.postLogin = (req, res, next) => {
  // process login and return cookie to user
  // res.setHeader("Set-Cookie", "loggedIn = true");
  // note the express-session package adds the session object to every request so we can use that object and add custom properites
  req.session.isAuthenticated = true;
  res.redirect("/");
};
