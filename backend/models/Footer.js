const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema(
  {
    logo: { type: String, required: false, default: null },
    brandName: { type: String, required: true, default: "Payana Trails" },
    subtitle: { type: String, required: true, default: "Crafting meaningful journeys through thoughtful, immersive travel experiences." },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: false, default: "" },
      }
    ],
    columns: [
      {
        heading: { type: String, required: true },
        links: [
          {
            label: { type: String, required: true },
            url: { type: String, required: false, default: "" },
          }
        ]
      }
    ],
    motto: { type: String, required: true, default: "Journeys, thoughtfully curated!" },
    mapButtonText: { type: String, required: true, default: "VIEW ON MAP" },
    mapLink: { type: String, required: false, default: "" },
    address: { type: String, required: true, default: "110, Sowmya Springs, Basavanagudi, Bangalore - 560 004" },
    email: { type: String, required: true, default: "info@payanatrails.com" },
    phone: { type: String, required: true, default: "+91 8660460512" },
    bottomLinks: [
      {
        label: { type: String, required: true },
        url: { type: String, required: false, default: "" },
      }
    ],
    copyrightText: { type: String, required: true, default: "© 2026 Payana Trails. All Rights Reserved." },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Footer", footerSchema);
