const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // importing the Listing model
const path = require("path");
const methodOverride = require("method-override"); // for PUT and DELETE requests
const ejsMate = require("ejs-mate");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

/* -------------------------- connecting to MongoDB ------------------------- */
const MONGO_URL = "mongodb://127.0.0.1:27017/lodgr";
main()
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
	res.send("Hi Iam Root");
});

/* ---------------------- route to render all listings ---------------------- */
app.get("/listings", async (req, res) => {
	try {
		const allListings = await Listing.find({});
		// console.log(allListings);
		res.render("listings/index.ejs", { allListings });
	} catch (err) {
		console.error("Error fetching listings:", err);
		res.status(500).send("Internal Server Error");
	}
});

/* ------------ route to render the form to create a new listing ------------ */
app.get("/listings/new", (req, res) => {
	res.render("listings/new.ejs");
});

/* ----- route to render a particular listing (using id) user clicked on ---- */
app.get("/listings/:id", async (req, res) => {
	let { id } = req.params;
	try {
		const listing = await Listing.findById(id);
		res.render("listings/show.ejs", { listing });
	} catch (err) {
		console.error("Error fetching listing:", err);
		res.status(500).send("Internal Server Error");
	}
});

/* ------------------- posts a new listing to the database and redirects to the all listings page ------------------- */
app.post("/listings", async (req, res) => {
	// let newListing = req.body.listing;
	// console.log(newListing);
	try {
		const newListing = new Listing(req.body.listing);
		await newListing.save();
		res.redirect("/listings");
	} catch (err) {
		console.error("Error creating listing:", err);
		res.status(500).send("Internal Server Error");
	}
});

/* --------------------------------------------------------- gets a form to edit a listing -------------------------------------------------------- */
app.get("/listings/:id/edit", async (req, res) => {
	let { id } = req.params;
	try {
		const listing = await Listing.findById(id);
		res.render("listings/edit.ejs", { listing });
	} catch (err) {
		console.error("Error fetching listing:", err);
		res.status(500).send("Internal Server Error");
	}
});

/* ----------------------------------- updates a listing in the database and redirects to the listing page ----------------------------------- */
app.put("/listings/:id", async (req, res) => {
	let { id } = req.params;
	try {
        console.log(req.body.listing);
		const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
		res.redirect(`/listings/${id}`);
	} catch (err) {
		console.error("Error updating listing:", err);
		res.status(500).send("Internal Server Error");
	}
});

/* ---------------------------------- deletes a listing from the database and redirects to the all listings page ---------------------------------- */
app.delete("/listings/:id", async(req, res) => {
    let { id } = req.params;
    try {
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
});

const port = 8080;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

//TODO: add notes about working and steps and syntax too
