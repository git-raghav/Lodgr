const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const passport = require("passport"); // for authentication
const { validateUserSignup, validateUserLogin, saveRedirectUrl } = require("../middleware.js");
const { renderSignup, signup, renderLogin, login, logout } = require("../controllers/user.js");

/* ---------------------- route to render signup page ---------------------- */
/* ---------------------- route to register a new user ---------------------- */
router.route("/signup").get(renderSignup).post(saveRedirectUrl, validateUserSignup, wrapAsync(signup));

/* ---------------------- route to render the login page ---------------------- */
/* ---------------------- route to authenticate the user ---------------------- */
router
	.route("/login")
	.get(renderLogin)
	.post(saveRedirectUrl, validateUserLogin, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), login);

/* ---------------------- route to logout the user ---------------------- */
router.get("/logout", logout);

module.exports = router;
