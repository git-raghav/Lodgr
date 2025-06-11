const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // importing the Listing model
const path = require("path");
const methodOverride = require("method-override"); // for PUT and DELETE requests
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); // utility to wrap async functions for error handling
const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const { listingSchema } = require("./schema.js"); // importing the Joi schema for validation

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // using ejsMate for layout support in EJS

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

/* --------------------------------------------- Middleware to validate listing data using Joi schema --------------------------------------------- */
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // If validation fails, throw an error
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

/* ---------------------- route to render all listings ---------------------- */
app.get("/listings", wrapAsync(async (req, res) => {
		const allListings = await Listing.find({});
		// console.log(allListings);
		res.render("listings/index.ejs", { allListings });
	})
);

/* ------------ route to render the form to create a new listing ------------ */
app.get("/listings/new", (req, res) => {
	res.render("listings/new.ejs");
});

/* ----- route to render a particular listing (using id) user clicked on ---- */
app.get("/listings/:id", wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id);
		res.render("listings/show.ejs", { listing });
	})
);

/* ------------------- posts a new listing to the database and redirects to the all listings page ------------------- */
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
		const newListing = new Listing(req.body.listing);
		await newListing.save();
		res.redirect("/listings");
	})
);

/* --------------------------------------------------------- gets a form to edit a listing -------------------------------------------------------- */
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
		let { id } = req.params;
		const listing = await Listing.findById(id);
		// console.log(listing);
		res.render("listings/edit.ejs", { listing });
	})
);

/* ----------------------------------- updates a listing in the database and redirects to the listing page ----------------------------------- */
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
		let { id } = req.params;
		// console.log(req.body.listing);
		await Listing.findByIdAndUpdate(id, req.body.listing);
		res.redirect(`/listings/${id}`);
	})
);

/* ---------------------------------- deletes a listing from the database and redirects to the all listings page ---------------------------------- */
app.delete("/listings/:id", wrapAsync(async (req, res) => {
		let { id } = req.params;
		await Listing.findByIdAndDelete(id);
		res.redirect("/listings");
	})
);

// if no above route matches, this middleware will be called
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page Not Found"));
});

// Custom error handling middleware jo saare errors ko handle karega
app.use((err, req, res, next) => {
	let { statusCode = 500, message = "Something went wrong" } = err;
	res.render("error.ejs", { statusCode, message });
});

const port = 8080;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
