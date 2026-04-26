const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" }, // Rich text (markdown-like)
    author: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    publishDate: { type: Date, default: Date.now },
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
    destination: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    isDraft: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    draftData: { type: mongoose.Schema.Types.Mixed, default: null }, // autosave draft
  },
  { timestamps: true }
);

// Text index for destination search
blogSchema.index({ destination: "text", title: "text" });

module.exports = mongoose.model("Blog", blogSchema);
