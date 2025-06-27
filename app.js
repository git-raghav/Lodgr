const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); // for PUT and DELETE requests
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const listings = require("./routes/listing.js"); // importing the listing routes
const reviews = require("./routes/review.js"); // importing the review routes
const session = require("express-session");
const flash = require("connect-flash"); // for flash messages

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // using ejsMate for layout support in EJS

//session handler
app.use(
	session({
		secret: "mysupersecretcode",
		resave: false,
		saveUninitialized: true,
		cookie: {
			expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // prevents client-side JavaScript from accessing the cookie
		},
	})
);
app.use(flash());

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

// Middleware to expose flash messages to views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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
