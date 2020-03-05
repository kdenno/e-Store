const express = require("express");
const router = express.Router();
const adminAjxFns = require("../controllers/adminAjax");
const isAuth = require("../middleware/is-auth");

router.delete("/product/:id", isAuth, adminAjxFns.deleteAjx);

exports.routes = router;
