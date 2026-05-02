const mongoose = require("mongoose");

const journeyPageSchema = new mongoose.Schema(
  {
    hero: {
      miniTitle: { type: String, default: "Explore Our World" },
      mainTitle: {
        type: String,
        default: "JOURNEYS THAT STAY,\nLONG AFTER YOU RETURN",
      },
      subtitle: {
        type: String,
        default:
          "Trails designed for those who value depth over distance – shaped by stories, places and experiences that stay with you.",
      },
    },
    signatureJourneys: {
      mainTitle: { type: String, default: "Signature Journeys" },
      subtitle: {
        type: String,
        default:
          "Discover our carefully curated experiences, blending rich heritage, immersive culture, breathtaking landscapes and unforgettable wildlife encounters.",
      },
    },
    ourTrails: {
      containerTitle: { type: String, default: "Trail Collections" },
      mainTitle: { type: String, default: "Our Trails" },
      subtitle: {
        type: String,
        default:
          "Choose your path. Whether you seek the thrill of the wild, the echoes of history, or the heartbeat of local communities, we have a journey for you.",
      },
      trails: [
        {
          title: { type: String, default: "" },
          iconImage: { type: String, default: "" },
        },
      ],
    },
    ourDestinations: {
      mainTitle: { type: String, default: "Our Destinations" },
      subtitle: {
        type: String,
        default:
          "The world is full of wonders waiting to be explored. Our handpicked destinations offer a gateway to extraordinary experiences.",
      },
    },
    payanaJourney: {
      italicText: {
        type: String,
        default: "Every Payana journey\nis carefully designed",
      },
      normalText: {
        type: String,
        default:
          "to balance exploration with comfort and time to absorb the landscape.",
      },
      image: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("JourneyPage", journeyPageSchema);
