if (process.env.NODE_ENV !== "production") {
	require("dotenv").config(); // load environment variables from .env file in development mode
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override"); // for PUT and DELETE requests
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // for flash messages
const passport = require("passport"); // for authentication
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listing.js"); // importing the listing routes
const reviewRouter = require("./routes/review.js"); // importing the review routes
const userRouter = require("./routes/user.js"); // importing the review routes

const User = require("./models/user.js"); // importing the User model

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // using ejsMate for layout support in EJS

//session handler
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: process.env.ATLAS_URL,
			crypto: {
				secret: process.env.SESSION_SECRET,
			},
			touchAfter: 24 * 60 * 60,
		}),
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
            secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS
			expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			httpOnly: true, // prevents client-side JavaScript from accessing the cookie
		},
	})
);
app.use(flash());

// Passport.js configuration and also it uses session so we have to use passport just after session
app.use(passport.initialize()); //Initializes Passport middleware.
app.use(passport.session()); //Enables persistent login sessions using cookies and express-session.
passport.use(new LocalStrategy(User.authenticate())); // Tells Passport to use the local strategy (username + password).User.authenticate() is provided by passport-local-mongoose.
passport.serializeUser(User.serializeUser()); // These handle how user data is stored in and retrieved from the session.
passport.deserializeUser(User.deserializeUser()); // These handle how user data is stored in and retrieved from the session.

/* -------------------------- connecting to MongoDB ------------------------- */
const MONGO_URL = process.env.ATLAS_URL;

main()
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => console.log(err));

async function main() {
	try {
 	   await mongoose.connect(MONGO_URL, {
 		   serverSelectionTimeoutMS: 10000,
 		   socketTimeoutMS: 45000,
 	   });
    } catch (err) {
 	   console.error("Initial MongoDB connection error:", err);
 	   process.exit(1);
    }
}

// Middleware to expose flash messages to views
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currentUser = req.user; // to access current user in views
	next();
});

// routes
app.get("/", (req, res) => {
	res.redirect("/listings");
});
app.get("/health", (req, res) => {
	res.send("OK");
});
app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// if no above route matches, this middleware will be called
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page Not Found"));
});

// Custom error handling middleware jo saare errors ko handle karega
app.use((err, req, res, next) => {
	let { statusCode = 500, message = "Something went wrong" } = err;
	res.render("error.ejs", { statusCode, message });
});

const port = process.env.PORT || 8080;
const server = app.listen(port, "0.0.0.0", () => {
	console.log(`Server is listening on port ${port}`);
});

// Set timeout values to prevent 502 errors on Render
server.keepAliveTimeout = 120 * 1000; // 120 seconds
server.headersTimeout = 130 * 1000; // must be > keepAliveTimeout

// Catch unhandled promise rejections (like DB or async errors not caught properly)
process.on("unhandledRejection", (err) => {
	console.error("Unhandled rejection:", err);
});
