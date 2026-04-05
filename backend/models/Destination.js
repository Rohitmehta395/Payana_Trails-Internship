const mongoose = require("mongoose");
const { DESTINATION_GEOGRAPHIES } = require("../constants/destinationGeographies");

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    geography: {
      type: String,
      required: true,
      enum: DESTINATION_GEOGRAPHIES,
      trim: true,
    },
    heroImage: {
      type: String, // Path to the uploaded image
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
