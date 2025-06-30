const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // importing the Listing model
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js"); // importing the isLoggedIn middleware to check if user is logged in
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing } = require("../controllers/listing.js");

/* ---------------------- route to render all listings ---------------------- */
router.get("/", wrapAsync(index));

/* ------------ route to render the form to create a new listing ------------ */
router.get("/new", isLoggedIn, renderNewForm);

/* ----- route to render a particular listing (using id) user clicked on ---- */
router.get("/:id", wrapAsync(showListing));

/* ------------------- posts a new listing to the database and redirects to the all listings page ------------------- */
router.post("/", isLoggedIn, validateListing, wrapAsync(createListing));

/* --------------------------------------------------------- gets a form to edit a listing -------------------------------------------------------- */
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

/* ----------------------------------- updates a listing in the database and redirects to the listing page ----------------------------------- */
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

/* ---------------------------------- deletes a listing from the database and redirects to the all listings page ---------------------------------- */
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;
