const mongoose = require("mongoose");

// Custom validator to limit the number of bullet points (array items)
const arrayLimit = (limit) => {
  return function (val) {
    return val.length <= limit;
  };
};

const itineraryDaySchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    points: { type: [String], default: [] },
    accommodation: { type: String, default: "" },
    meals: { type: String, default: "" },
  },
  { _id: false },
);

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
    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },
    itineraryDraft: {
      type: [itineraryDaySchema],
      default: [],
    },
    optionalExperiences: {
      type: [String],
      default: [],
      validate: [
        (val) => val.length <= 4,
        "Optional experiences cannot exceed 4 lines"
      ],
    },
    flights: {
      domesticIntro:      { type: String, default: "" },
      domesticLines:      { type: [String], default: [] },
      internationalIntro: { type: String, default: "" },
      arrivalAirport:     { type: String, default: "" },
      arrivalOptions:     { type: [String], default: [] },
      departureAirport:   { type: String, default: "" },
      departureOptions:   { type: [String], default: [] },
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
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple nulls if necessary, though we aim to populate it
    },
  },
  { timestamps: true },
);

// Helper function to generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Always regenerate slug from trailName on every save so the link stays in sync
trailSchema.pre("save", async function () {
  // Regenerate slug whenever trailName is present — always keep them in sync
  if (this.trailName) {
    let baseSlug = slugify(this.trailName);
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check for uniqueness (exclude the current document)
    while (true) {
      const Model = this.constructor;
      const existingTrail = await Model.findOne({
        slug: uniqueSlug,
        _id: { $ne: this._id },
      });
      if (!existingTrail) break;
      uniqueSlug = `${baseSlug}-${counter++}`;
    }
    this.slug = uniqueSlug;
  } else if (!this.slug) {
    // Fallback: no name yet (pure draft), assign a placeholder
    this.slug = `unnamed-trail-${this._id}`;
  }
});

module.exports = mongoose.model("Trail", trailSchema);

