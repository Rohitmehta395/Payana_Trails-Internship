const mongoose = require("mongoose");

const trailSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Wildlife", "Heritage", "Cultural"],
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    date: { type: String, required: true },
    trail: { type: String, required: true },
    imgSrc: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trail", trailSchema);
