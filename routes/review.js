const express = require("express");
const router = express.Router({ mergeParams: true }); //if there is something in the parent params like id that we have to use then we have to use mergeParams
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/review.js");

/* --------------------------------------- posts a new review to a listing and redirects to the listing page -------------------------------------- */
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

/* ---------------------------------- deletes a review from a listing and redirects to the listing page ---------------------------------- */
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;
