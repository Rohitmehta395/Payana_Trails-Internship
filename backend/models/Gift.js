const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
    },
    senderEmail: {
      type: String,
      required: [true, "Sender email is required"],
    },
    senderCountryCode: {
      type: String,
      default: "+91",
      trim: true,
    },
    senderPhone: {
      type: String,
    },
    recipientName: {
      type: String,
      required: [true, "Recipient name is required"],
    },
    recipientEmail: {
      type: String,
      required: [true, "Recipient email is required"],
    },
    recipientCountryCode: {
      type: String,
      default: "+91",
      trim: true,
    },
    recipientPhone: {
      type: String,
    },
    giftType: {
      type: String,
      enum: ["Journey", "Credit"],
      default: "Journey",
    },
    journeyDetails: {
      type: String,
    },
    giftValue: {
      type: String,
    },
    occasion: {
      type: String,
    },
    personalMessage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Completed"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Gift", GiftSchema);
