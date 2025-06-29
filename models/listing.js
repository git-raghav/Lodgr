const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 100,
	},
	description: {
		type: String,
		required: true,
		minLength: 10,
		maxLength: 5000,
	},
	amenities: [String],
	maxGuests: {
		type: Number,
		required: true,
		min: 1,
		max: 20,
	},
	image: {
		type: String,
		default:
			"https://plus.unsplash.com/premium_vector-1711987911074-aa7349e74a81?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		// Custom setter to handle empty strings or undefined values
		set: (v) =>
			v === "" || !v
				? "https://plus.unsplash.com/premium_vector-1711987911074-aa7349e74a81?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				: v,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
		max: 1000000,
	},
	location: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 150,
	},
	country: {
		type: String,
		required: true,
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review",
		},
	],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

//this post middleware will run after a document is deleted to delete its reviews
//findbyidanddelete indirectly calls findOneAndDelete and when findOneAndDelete operation is done on listingSchema this middleware will run automatically
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
