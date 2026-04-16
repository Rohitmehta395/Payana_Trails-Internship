const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    referrerName: {
      type: String,
      required: [true, "Referrer name is required"],
      trim: true,
    },
    referrerEmail: {
      type: String,
      required: [true, "Referrer email is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
    },
    referrerCountryCode: {
      type: String,
      default: "+91",
      trim: true,
    },
    referrerPhone: {
      type: String,
      trim: true,
    },
    friendName: {
      type: String,
      required: [true, "Friend's name is required"],
      trim: true,
    },
    friendEmail: {
      type: String,
      required: [true, "Friend's email is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
    },
    friendCountryCode: {
      type: String,
      default: "+91",
      trim: true,
    },
    friendPhone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [300, "Message cannot exceed 300 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "rewarded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);
