// backend/seedAdmin.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");
const connectDB = require("./config/db");

dotenv.config();

const seedAdmin = async () => {
  try {
    // Wait for the database connection before running any queries!
    await connectDB();

    const adminExists = await Admin.findOne({
      email: "admin@payanatrails.com",
    });

    if (adminExists) {
      console.log("Admin user already exists!");
      process.exit();
    }

    const admin = await Admin.create({
      email: "rohitmehtaddn@gmail.com",
      password: "Rohitmehta",
    });

    console.log(`Admin created successfully with email: ${admin.email}`);
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
