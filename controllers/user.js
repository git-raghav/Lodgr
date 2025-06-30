const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
	res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
	try {
		let { username, email, password } = req.body;
		const newUser = new User({ username, email });
		await User.register(newUser, password);
		// After successful registration, log the user in
		req.login(newUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", "Signed up successfully! Welcome to Lodgr!");
			// Redirect to the original URL if it exists, otherwise redirect to listings
			// if user is signing up from a listing page, isloggedIn middleware will not be called and redirectUrl will not be set
			// so we have to check if res.locals.redirectUrl is set or not
			if (res.locals.redirectUrl) {
				res.redirect(res.locals.redirectUrl);
			} else {
				res.redirect("/listings");
			}
		});
	} catch (err) {
		// If there's an error during registration, flash the error message and redirect to the signup page
		if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
			req.flash("error", "Email is already registered. Please use a different one.");
		} else {
			req.flash("error", err.message);
		}
		res.redirect("/signup");
	}
};

module.exports.renderLogin = (req, res) => {
	res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
	req.flash("success", "Logged in successfully! Welcome back to Lodgr!");
	// Redirect to the original URL if it exists, otherwise redirect to listings
	// if user is signing up from a listing page, isloggedIn middleware will not be called and redirectUrl will not be set
	// so we have to check if res.locals.redirectUrl is set or not
	if (res.locals.redirectUrl) {
		res.redirect(res.locals.redirectUrl);
	} else {
		res.redirect("/listings");
	}
};

module.exports.logout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logged out successfully!");
		res.redirect("/listings");
	});
};
