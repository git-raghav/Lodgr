//schema validation using Joi, validates the data before it is sent to the database, reducing db lookups
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
	listing: Joi.object({
		title: Joi.string().min(2).max(100).required(),
		description: Joi.string().min(10).max(5000).required(),
		maxGuests: Joi.number().min(1).max(20).required(),
		amenities: Joi.string().required(),
		image: Joi.string().uri().allow(""),
		price: Joi.number().min(0).max(1000000).required(),
		location: Joi.string().min(2).max(150).required(),
		country: Joi.string().required(),
	}).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().min(1).max(2000).required(),
    }).required(),
});
