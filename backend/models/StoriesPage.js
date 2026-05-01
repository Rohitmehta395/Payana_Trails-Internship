const mongoose = require("mongoose");

const storiesPageSchema = new mongoose.Schema(
  {
    travelStories: {
      mainTitle: { type: String, default: "Travel Stories" },
      subtitle: {
        type: String,
        default:
          "Reflections, insights, and moments from journeys across the world",
      },
      image: { type: String, default: "" },
      image1: { type: String, default: "" },
      image2: { type: String, default: "" },
      selectedBlogs: {
        type: Map,
        of: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
        default: {},
      },
      showFeatured: { type: Boolean, default: false },
      showFeatured3: { type: Boolean, default: false },
    },
    voicesSection: {
      title: { type: String, default: "Voices from the Trail" },
      subtitle: { type: String, default: "Hear from those who have journeyed with us." },
      image: { type: String, default: "" },
    },
    newsletterSection: {
      title: { type: String, default: "The Payana Journal" },
      subtitle: { type: String, default: "Subscribe to receive our latest stories, journey updates, and exclusive reflections directly in your inbox." },
      image: { type: String, default: "" },
    },
    guestStoriesSection: {
      title: { type: String, default: "Stories from Our Guests" },
      subtitle: { type: String, default: "Hear from those who have journeyed with us and shared their experiences." },
      image: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StoriesPage", storiesPageSchema);
