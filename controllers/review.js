const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	const newReview = new Review(req.body.review);
	newReview.author = req.user._id;
	// console.log(listing);
	// console.log(newReview);
	listing.reviews.push(newReview); //pushing the new review's id to the listing's reviews array
	await newReview.save();
	await listing.save();
	req.flash("success", "Review posted successfully!");
	res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
	let { id, reviewId } = req.params;
	await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //removes reviewid from listing array
	await Review.findByIdAndDelete(reviewId); //deletes the review
	req.flash("success", "Review deleted successfully!");
	res.redirect(`/listings/${id}`);
};
