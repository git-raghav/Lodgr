const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 2000,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
