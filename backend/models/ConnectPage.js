const mongoose = require("mongoose");

const connectPageSchema = new mongoose.Schema(
  {
    enquirySection: {
      typographyText: { type: String, default: "Tailored For You" },
      titleBold: { type: String, default: "" },
      titleItalic: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      leftImage: { type: String, default: "" },
      rightImage: { type: String, default: "" },
    },
    referFriendSection: {
      typographyText: { type: String, default: "Refer A Friend" },
      titleBold: { type: String, default: "" },
      titleItalic: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      block1Label: { type: String, default: "" },
      block1Title: { type: String, default: "" },
      block1Body: { type: String, default: "" },
      block2Label: { type: String, default: "" },
      block2Title: { type: String, default: "" },
      block2Body: { type: String, default: "" },
      image: { type: String, default: "" },
      imageBlockLabel: { type: String, default: "" },
      imageBlockTitle: { type: String, default: "" },
      imageBlockBody: { type: String, default: "" },
    },
    giftJourneySection: {
      typographyText: { type: String, default: "Gift A Journey" },
      titleBold: { type: String, default: "" },
      titleItalic: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      block1Label: { type: String, default: "" },
      block1Title: { type: String, default: "" },
      block1Body: { type: String, default: "" },
      block2Label: { type: String, default: "" },
      block2Title: { type: String, default: "" },
      block2Body: { type: String, default: "" },
      image: { type: String, default: "" },
      imageBlockLabel: { type: String, default: "" },
      imageBlockTitle: { type: String, default: "" },
      imageBlockBody: { type: String, default: "" },
    },
    faqSection: {
      typographyText: { type: String, default: "Knowledge Base" },
      titleBold: { type: String, default: "" },
      titleItalic: { type: String, default: "" },
      subtitle: { type: String, default: "" },
    },
    connectSection: {
      typographyText: { type: String, default: "Get In Touch" },
      titleBold: { type: String, default: "" },
      titleItalic: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      meetLink: { type: String, default: "" },
      socialMedia: {
        titleBold: { type: String, default: "" },
        titleItalic: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        items: [
          {
            text: { type: String, default: "" },
            link: { type: String, default: "" },
          }
        ]
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConnectPage", connectPageSchema);
