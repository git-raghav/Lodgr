const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // importing the User model
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const passport = require("passport"); // for authentication
const { validateUserSignup, validateUserLogin } = require("../middleware.js");

/* ---------------------- route to render signup page ---------------------- */
router.get("/signup", (req, res) => {
	res.render("users/signup.ejs");
});

/* ---------------------- route to register a new user ---------------------- */
router.post(
	"/signup",
	validateUserSignup,
	wrapAsync(async (req, res) => {
		try {
			let { username, email, password } = req.body;
			const newUser = new User({ username, email });
			await User.register(newUser, password);
			req.flash("success", "Signed up successfully! Welcome to Lodgr!");
			res.redirect("/listings");
		} catch (err) {
			// If there's an error during registration, flash the error message and redirect to the signup page
			if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
				req.flash("error", "Email is already registered. Please use a different one.");
			} else {
				req.flash("error", err.message);
			}
			res.redirect("/signup");
		}
	})
);

/* ---------------------- route to render the login page ---------------------- */
router.get("/login", (req, res) => {
	res.render("users/login.ejs");
});

/* ---------------------- route to authenticate the user ---------------------- */
router.post("/login", validateUserLogin, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
	req.flash("success", "Logged in successfully! Welcome back to Lodgr!");
	res.redirect("/listings");
});

/* ---------------------- route to logout the user ---------------------- */
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
});

module.exports = router;
