const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData = require('./data.js');

const MONGO_URL= "mongodb://127.0.0.1:27017/lodgr";
main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

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
