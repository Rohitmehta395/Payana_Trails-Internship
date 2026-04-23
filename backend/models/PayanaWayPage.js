const mongoose = require("mongoose");

const payanaWayPageSchema = new mongoose.Schema(
  {
    aJourneyBegins: {
      adminImage: { type: String, required: true },
      description: { type: String, required: true },
      paragraph: { type: String, required: true },
      name: { type: String, required: true },
      occupation: { type: String, required: true },
      signatureImage: { type: String, required: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PayanaWayPage", payanaWayPageSchema);
