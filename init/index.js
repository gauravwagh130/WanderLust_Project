const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Connection failed", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Initialize Database with predefined data
const initDB = async () => {
  try {
    // Clear the Listing collection
    await Listing.deleteMany({});
    console.log("Existing data cleared");

    // Modify initData with fixed owner ID
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "66ed6d0bcfe0c431c225a01c",
    }));

    // Insert new listings
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing database", err);
  }
};

// Initialize database
initDB();
