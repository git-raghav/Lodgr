const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js"); // importing the isLoggedIn middleware to check if user is logged in
const {
	index,
	renderNewForm,
	showListing,
	createListing,
	renderEditForm,
	updateListing,
	deleteListing,
} = require("../controllers/listing.js");

/* ---------------------- route to render all listings ---------------------- */
/* ------------------- posts a new listing to the database and redirects to the all listings page ------------------- */
router.route("/").get(wrapAsync(index)).post(isLoggedIn, validateListing, wrapAsync(createListing));

/* ------------ route to render the form to create a new listing ------------ */
router.get("/new", isLoggedIn, renderNewForm);

/* ----- route to render a particular listing (using id) user clicked on ---- */
/* ---------------- updates a listing in the database and redirects to the listing page -------------------- */
/* -------------------- deletes a listing from the database and redirects to the all listings page ---------------------- */
router
	.route("/:id")
	.get(wrapAsync(showListing))
	.put(isLoggedIn, isOwner, validateListing, wrapAsync(updateListing))
	.delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

/* ---------------------------- gets a form to edit a listing ---------------------------------- */
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
