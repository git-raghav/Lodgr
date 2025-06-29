const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const { listingSchema, reviewSchema, userSchemaSignup, userSchemaLogin } = require("./schema.js"); // importing the Joi schema for validation
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

/* --------------------------------------------- Middleware to validate listing data using Joi schema --------------------------------------------- */
module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error);
	} else {
		next();
	}
};

/* --------------------------------------------- Middleware to validate review data using Joi schema --------------------------------------------- */
module.exports.validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error);
	} else {
		next();
	}
};

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
	// console.log(req.originalUrl);
	if (!req.isAuthenticated()) {
        // 
		if (req.method !== "GET" && req.params.id) {
			req.session.redirectUrl = `/listings/${req.params.id}`;
		} else if (req.method === "GET") {
			req.session.redirectUrl = req.originalUrl;
		}
		req.flash("error", "You must be logged in to perform this action!");
		return res.redirect("/login");
	}
	next();
};

/* --------------------------------------------- Middleware to save redirect URL --------------------------------------------- */
module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};

/* ------------------------------ Middleware to check if the user is the owner of the listing ----------------------------- */
module.exports.isOwner = async (req, res, next) => {
	let { id } = req.params;
	// console.log(req.body.listing);
	let listing = await Listing.findById(id);
	// only the owner of the listing can edit it
	if (!res.locals.currentUser._id.equals(listing.owner._id)) {
		req.flash("error", "You do not have permission to make changes to this listing!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};

/* ------------------------------ Middleware to check if the user is the author of the review ----------------------------- */
module.exports.isReviewAuthor = async (req, res, next) => {
	let { id, reviewId } = req.params;
	let review = await Review.findById(reviewId);
	// only the owner of the review can edit it
	if (!res.locals.currentUser._id.equals(review.author._id)) {
		req.flash("error", "You do not have permission to make changes to this review!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};
