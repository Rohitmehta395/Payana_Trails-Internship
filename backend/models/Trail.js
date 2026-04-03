const mongoose = require("mongoose");

// Custom validator to limit the number of bullet points (array items)
const arrayLimit = (limit) => {
  return function (val) {
    return val.length <= limit;
  };
};

const trailSchema = new mongoose.Schema(
  {
    trailTheme: {
      type: String,
      required: true,
      // You can keep your enums here if needed:
      // enum: ["Wildlife", "Heritage", "Cultural"],
    },
    trailType: {
      type: String,
      required: true,
    },
    trailName: {
      type: String,
      required: true,
    },
    trailDestination: {
      type: String,
      required: true,
    },
    trailSubTitle: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    journeyDate: {
      type: Date,
      // Mongoose stores this as an ISO date.
      // Formatting it to "DD MMM YYYY" (e.g., 18-Jun-26) should be handled on the frontend.
    },
    trailRoute: {
      type: String,
      required: true,
    },
    visa: {
      type: String,
      required: true,
    },
    bestTimeToTravel: {
      type: String,
      required: true,
    },
    comfortLevel: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    highlights: {
      type: [String], // Array of strings is best for rendering bullet points
      required: true,
      validate: [arrayLimit(6), "Highlights cannot exceed 6 bullet points"],
    },
    isThisJourneyForYou: {
      type: String,
      required: true,
    },
    routeMap: {
      type: String, // Storing the image URL or Cloudinary path
      required: true,
    },
    heroImage: {
      type: String,
      required: true,
    },
    trailImages: {
      type: [String],
      default: [],
    },
    whatsIncluded: {
      type: [String],
      required: true,
      validate: [arrayLimit(18), "Inclusions cannot exceed 8 bullet points"],
    },
    whatsNotIncluded: {
      type: [String],
      required: true,
      validate: [arrayLimit(18), "Exclusions cannot exceed 8 bullet points"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trail", trailSchema);
