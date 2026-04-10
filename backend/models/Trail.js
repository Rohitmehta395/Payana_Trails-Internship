const mongoose = require("mongoose");

// Custom validator to limit the number of bullet points (array items)
const arrayLimit = (limit) => {
  return function (val) {
    return val.length <= limit;
  };
};

const trailSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    trailTheme: {
      type: String,
      required: function() { return this.status === 'published'; },
      // You can keep your enums here if needed:
      // enum: ["Wildlife", "Heritage", "Cultural"],
    },
    trailType: {
      type: String,
    },
    trailName: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    trailDestination: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    trailSubTitle: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    duration: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    journeyDate: {
      type: Date,
    },
    trailRoute: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    visa: {
      type: String,
    },
    bestTimeToTravel: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    comfortLevel: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    overview: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    highlights: {
      type: [String], // Array of strings is best for rendering bullet points
      required: function() { return this.status === 'published'; },
      validate: [
        function(val) { return this.status === 'draft' || val.length <= 8; },
        "Highlights cannot exceed 8 bullet points"
      ],
    },
    isThisJourneyForYou: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    routeMap: {
      type: String, // Storing the image URL or Cloudinary path
      required: function() { return this.status === 'published'; },
    },
    heroImage: {
      type: String,
      required: function() { return this.status === 'published'; },
    },
    trailImages: {
      type: [String],
      default: [],
    },
    whatsIncluded: {
      type: [String],
      required: function() { return this.status === 'published'; },
      validate: [
        function(val) { return this.status === 'draft' || val.length <= 18; },
        "Inclusions cannot exceed 18 bullet points"
      ],
    },
    whatsNotIncluded: {
      type: [String],
      required: function() { return this.status === 'published'; },
      validate: [
        function(val) { return this.status === 'draft' || val.length <= 18; },
        "Exclusions cannot exceed 18 bullet points"
      ],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: function() {
        return this.status !== 'draft';
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trail", trailSchema);
