const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema(
  {
    heroSection: {
      headerTitle: { type: String, required: true },
      subtitle: { type: String, required: true },
    },
    thePayanaWay: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      quote: { type: String, required: true },
      highlights: {
        type: [String],
        validate: [v => v.length === 4, 'Highlights must have exactly 4 items.'],
        required: true,
      },
      heroImage: { type: String, required: false },
    },
    storiesAndVoices: {
      title: { type: String, required: true },
      quote: { type: String, required: true },
      heroImage: { type: String, required: false },
    },
    newsletterSection: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
    },
    connectSection: {
      quote: { type: String, required: true },
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      email: { type: String, required: true },
      number: { type: String, required: true },
      heroImage: { type: String, required: false },
    },
    referAndGiftSection: {
      mainTitleBold: { type: String, required: true },
      mainTitleItalic: { type: String, required: true },
      mainSubtitle: { type: String, required: true },
      referYourFriends: {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        heroImage: { type: String, required: false },
      },
      giftAJourney: {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        heroImage: { type: String, required: false },
      },
    },
    testimonials: {
      titleBold: { type: String, default: "" },
      titleItalic: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      images: [
        {
          url: { type: String, required: false },
          alt: { type: String, default: "" },
          shortDescription: { type: String, default: "" },
          fullContent: { type: String, default: "" },
          destination: { type: String, default: "" },
          monthYear: { type: String, default: "" },
          isActive: { type: Boolean, default: true },
          order: { type: Number, default: 0 },
        }
      ]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomePage", homePageSchema);
