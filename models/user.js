const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); // for username and password authentication

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		lowercase: true, // stores email in lowercase
		trim: true, // removes leading and trailing spaces
	},
});
userSchema.plugin(passportLocalMongoose);// adds username and password fields, hash and salt to the schema and provides methods like authenticate, serialize and deserialize for authentication

const User = mongoose.model("User", userSchema);
module.exports = User;
