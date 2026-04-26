const mongoose = require("mongoose");

const payanaWayPageSchema = new mongoose.Schema(
  {
    aJourneyBegins: {
      mainTitle: { type: String, default: "A Journey Begins" },
      subtitle: { type: String, default: "" },
      adminImage: { type: String, default: "" },
      description: { type: String, default: "" },
      paragraph: { type: String, default: "" },
      name: { type: String, default: "" },
      occupation: { type: String, default: "" },
      signatureImage: { type: String, default: "" },
    },
    thePayanaDifference: {
      mainTitle: { type: String, default: "The Payana Difference" },
      subtitle: { type: String, default: "" },
      mainImage: { type: String, default: "" },
      entries: [
        {
          title: { type: String, default: "" },
          subtitle: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
    },
    journeysWithPurpose: {
      mainTitle: { type: String, default: "Journeys with Purpose" },
      subtitle: { type: String, default: "Journeys that enrich you, while leaving a positive difference behind." },
      blocks: [
        {
          image: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
    },
    inTheMedia: {
      mainTitle: { type: String, default: "In The Media" },
      subtitle: { type: String, default: "Journeys and reflections, captured through published articles." },
      items: [
        {
          image: { type: String, default: "" },
          publishedBy: { type: String, default: "" },
          authorName: { type: String, default: "" },
          date: { type: String, default: "" },
          description: { type: String, default: "" },
          url: { type: String, default: "" },
        },
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PayanaWayPage", payanaWayPageSchema);
