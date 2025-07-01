const mongoose = require("mongoose");
const Review = require("./review.js");

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
		url: String,
        filename: String,
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
