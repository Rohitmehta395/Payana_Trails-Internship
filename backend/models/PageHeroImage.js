const mongoose = require("mongoose");

/**
 * PAGE_KEYS — canonical identifiers for every manageable page.
 * The frontend and admin both use these exact strings.
 */
const PAGE_KEYS = [
  "home",
  "journeys",
  "payana-way",
  "stories",
  "connect",
  "journeys/destinations",
  "journeys/signature",
  "journeys/wildlife",
  "journeys/heritage",
  "journeys/cultural",
  "connect/faqs",
];

const heroImageSchema = new mongoose.Schema(
  {
    /** Desktop image URL (required) */
    url: { type: String, required: true },
    /** Mobile / portrait image URL (optional — falls back to url if absent) */
    mobileUrl: { type: String, default: "" },
    /** Alt text / caption for accessibility */
    alt: { type: String, default: "" },
    /** Display order – lower numbers come first */
    order: { type: Number, default: 0 },
    /** Whether this image is active / visible on the live site */
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const pageHeroImageSchema = new mongoose.Schema(
  {
    /** Unique page key maps to a URL path (e.g. "home", "journeys/wildlife") */
    pageKey: {
      type: String,
      required: true,
      unique: true,
      enum: PAGE_KEYS,
    },
    /** Ordered list of hero images for this page */
    images: {
      type: [heroImageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PageHeroImage", pageHeroImageSchema);
module.exports.PAGE_KEYS = PAGE_KEYS;
