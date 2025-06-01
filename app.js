const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL= "mongodb://127.0.0.1:27017/lodgr";
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

const port = 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

//TODO: add notes about working and steps and syntax too
