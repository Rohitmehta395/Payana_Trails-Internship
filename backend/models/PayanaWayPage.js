const mongoose = require("mongoose");

const payanaWayPageSchema = new mongoose.Schema(
  {
    aJourneyBegins: {
      adminImage: { type: String, default: "" },
      description: { type: String, default: "" },
      paragraph: { type: String, default: "" },
      name: { type: String, default: "" },
      occupation: { type: String, default: "" },
      signatureImage: { type: String, default: "" },
    },
    thePayanaDifference: {
      mainImage: { type: String, default: "" },
      entries: [
        {
          title: { type: String, default: "" },
          subtitle: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PayanaWayPage", payanaWayPageSchema);
