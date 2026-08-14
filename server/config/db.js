const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(
      process.env.DB_URL
    );

    console.log(
      "Successfully connected to the database"
    );
  } catch (error) {
    console.error(
      "Error while connecting to the database:",
      error.message
    );

    throw error;
  }
};

module.exports = connectDB;