const mongoose = require("mongoose");

const legalSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["privacy-policy", "terms-and-conditions"],
      required: true,
      index: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
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

module.exports = mongoose.model("LegalSection", legalSectionSchema);
