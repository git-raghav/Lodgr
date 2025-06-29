const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // importing the Listing model
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js"); // importing the isLoggedIn middleware to check if user is logged in

/* ---------------------- route to render all listings ---------------------- */
router.get("/", wrapAsync(async (req, res) => {
		const allListings = await Listing.find({});
		// console.log(allListings);
		res.render("listings/index.ejs", { allListings });
	})
);

/* ------------ route to render the form to create a new listing ------------ */
router.get("/new", isLoggedIn, (req, res) => {
	res.render("listings/new.ejs");
});

/* ----- route to render a particular listing (using id) user clicked on ---- */
router.get("/:id", wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id).populate("reviews").populate("owner");
        // console.log(listing);
        if(!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
		res.render("listings/show.ejs", { listing });
	})
);

/* ------------------- posts a new listing to the database and redirects to the all listings page ------------------- */
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
		const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // setting the owner of the listing to the current user
        // console.log(newListing);
		await newListing.save();
        req.flash("success", "New listing created successfully!");
		res.redirect("/listings");
	})
);

/* --------------------------------------------------------- gets a form to edit a listing -------------------------------------------------------- */
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id);
		// console.log(listing);
        if(!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
		res.render("listings/edit.ejs", { listing });
	})
);

/* ----------------------------------- updates a listing in the database and redirects to the listing page ----------------------------------- */
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
		let { id } = req.params;
		// console.log(req.body.listing);
		await Listing.findByIdAndUpdate(id, req.body.listing);
        req.flash("success", "Listing updated successfully!");
		res.redirect(`/listings/${id}`);
	})
);

/* ---------------------------------- deletes a listing from the database and redirects to the all listings page ---------------------------------- */
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
		let { id } = req.params;
		await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted successfully!");
		res.redirect("/listings");
	})
);

module.exports = router;
