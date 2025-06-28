const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const { listingSchema, reviewSchema, userSchemaSignup, userSchemaLogin } = require("./schema.js"); // importing the Joi schema for validation

/* --------------------------------------------- Middleware to validate listing data using Joi schema --------------------------------------------- */
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

/* --------------------------------------------- Middleware to validate review data using Joi schema --------------------------------------------- */
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

/* --------------------------------------------- Middleware to validate user signup data using Joi schema --------------------------------------------- */
module.exports.validateUserSignup = (req, res, next) => {
	let { error } = userSchemaSignup.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error);
	} else {
		next();
	}
};

/* --------------------------------------------- Middleware to validate user login data using Joi schema --------------------------------------------- */
module.exports.validateUserLogin = (req, res, next) => {
	let { error } = userSchemaLogin.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error);
	} else {
		next();
	}
};

/* --------------------------------------------- Middleware to check if user is logged in --------------------------------------------- */
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to perform this action!");
        return res.redirect("/login");
    }
    next();
};
