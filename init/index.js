if(process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "../.env" }); // load environment variables from .env file in development mode
}
const mongoose = require('mongoose');
const Listing = require("../models/listing.js");// Import the Listing model
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
