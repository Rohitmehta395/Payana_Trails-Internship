const mongoose = require("mongoose");

const legalPageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["privacy-policy", "terms-and-conditions"],
      required: true,
      unique: true,
    },
    title: { type: String, default: "" },
    content: { type: String, default: "" }, // Rich text (markdown)
    isDraft: { type: Boolean, default: true },
    draftData: { type: mongoose.Schema.Types.Mixed, default: null }, // autosave draft
    lastPublishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LegalPage", legalPageSchema);
