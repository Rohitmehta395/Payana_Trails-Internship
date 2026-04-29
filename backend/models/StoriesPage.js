const mongoose = require("mongoose");

const storiesPageSchema = new mongoose.Schema(
  {
    travelStories: {
      mainTitle: { type: String, default: "Travel Stories" },
      subtitle: {
        type: String,
        default: "Reflections, insights, and moments from journeys across the world",
      },
      image: { type: String, default: "" },
      image1: { type: String, default: "" },
      image2: { type: String, default: "" },
      selectedBlogs: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
        default: {},
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoriesPage", storiesPageSchema);
