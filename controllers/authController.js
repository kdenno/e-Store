const express = require("express");
exports.getLogin = (req, res, next) => {
  const loggedIn = req
    .get("Cookie")
    .split(";")[1]
    .trim()
    .split("=")[1];
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: true
  });
};

exports.postLogin = (req, res, next) => {
  // process login and return cookie to user
  res.setHeader("Set-Cookie", "loggedIn = true");
  res.redirect("/");
};
