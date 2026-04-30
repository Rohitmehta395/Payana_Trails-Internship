const mongoose = require("mongoose");

const externalStorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: "" },
    author: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "Heritage Trails",
        "Wildlife Encounters",
        "Cultural Windows",
        "Journey Insights",
        "Photo Essays",
        "Travel Anecdotes",
      ],
      default: "Journey Insights",
    },
    destination: { type: String, default: "" }, // Linked destination name
    location: { type: String, default: "" }, // Specific spot/location
    externalUrl: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    isDraft: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    draftData: { type: mongoose.Schema.Types.Mixed, default: null }, // autosave draft
  },
  { timestamps: true }
);

// Text index for destination/location search
externalStorySchema.index({ destination: "text", location: "text", title: "text" });

module.exports = mongoose.model("ExternalStory", externalStorySchema);
