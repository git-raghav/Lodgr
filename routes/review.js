const express = require("express");
const router = express.Router({ mergeParams: true });//if there is something in the parent params like id that we have to use then we have to use mergeParams
const Listing = require("../models/listing.js"); // importing the Listing model
const Review = require("../models/review.js"); // importing the review model
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const ExpressError = require("../utils/ExpressError.js"); // custom error class for Express
const { reviewSchema } = require("../schema.js"); // importing the Joi schema for validation

/* --------------------------------------------- Middleware to validate review data using Joi schema --------------------------------------------- */
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

/* --------------------------------------- posts a new review to a listing and redirects to the listing page -------------------------------------- */
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    // console.log(listing);
    // console.log(newReview);
    listing.reviews.push(newReview);//pushing the new review's id to the listing's reviews array
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

/* ---------------------------------- deletes a review from a listing and redirects to the listing page ---------------------------------- */
router.delete("/:reviewId", wrapAsync(async (req, res) => {
		let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//removes reviewid from listing array
		await Review.findByIdAndDelete(reviewId);//deletes the review
		res.redirect(`/listings/${id}`);
	})
);

module.exports = router;
