if(process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "../.env" }); // load environment variables from .env file in development mode
}
const mongoose = require('mongoose');
const Listing = require("../models/listing.js");// Import the Listing model
const User = require("../models/user.js");// Import the user model
const initData = require('./data.js');// Import the sample data

const MONGO_URL= process.env.ATLAS_URL;

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Function to initialize the database with sample data
// This function clears the existing listings and inserts the sample data
const initDB = async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});

    const dummyUserId = new mongoose.Types.ObjectId("6863fbad455fc8838392ab61");
    const dummyUser = new User({
        _id: dummyUserId,
        username: process.env.DEMO_USERNAME,
        email: process.env.DEMO_EMAIL,
    });
    await User.register(dummyUser, process.env.DEMO_PASSWORD);

    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDB()
    .then(() => {
        console.log("Database initialization complete");
    })
    .catch((err) => {
        console.error("Error initializing database:", err);
    });
