const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
	const allListings = await Listing.find({});
	// console.log(allListings);
	res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
	res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("owner");
	// console.log(listing);
	if (!listing) {
		req.flash("error", "Listing not found!");
		return res.redirect("/listings");
	}
	res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
	const newListing = new Listing(req.body.listing);
	newListing.owner = req.user._id; // setting the owner of the listing to the current user
	// console.log(newListing);
	await newListing.save();
	req.flash("success", "New listing created successfully!");
	res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	// console.log(listing);
	if (!listing) {
		req.flash("error", "Listing not found!");
		return res.redirect("/listings");
	}
	res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	// console.log(req.body.listing);
	await Listing.findByIdAndUpdate(id, req.body.listing);
	req.flash("success", "Listing updated successfully!");
	res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
	let { id } = req.params;
	await Listing.findByIdAndDelete(id);
	req.flash("success", "Listing deleted successfully!");
	res.redirect("/listings");
};
