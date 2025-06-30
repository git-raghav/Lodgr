const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // importing the User model
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const passport = require("passport"); // for authentication
const { validateUserSignup, validateUserLogin, saveRedirectUrl } = require("../middleware.js");
const { renderSignup, signup, renderLogin, login, logout } = require("../controllers/user.js");

/* ---------------------- route to render signup page ---------------------- */
router.get("/signup", renderSignup);

/* ---------------------- route to register a new user ---------------------- */
router.post("/signup", saveRedirectUrl, validateUserSignup, wrapAsync(signup));

/* ---------------------- route to render the login page ---------------------- */
router.get("/login", renderLogin);

/* ---------------------- route to authenticate the user ---------------------- */
router.post(
	"/login",
	saveRedirectUrl,
	validateUserLogin,
	passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
	login
);

/* ---------------------- route to logout the user ---------------------- */
router.get("/logout", logout);

module.exports = router;
