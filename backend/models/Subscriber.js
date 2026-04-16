const mongoose = require("mongoose");
const crypto = require("crypto");

const subscriberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
    },
    countryCode: {
      type: String,
      default: "+91",
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },
    unsubscribeToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate unsubscribe token
subscriberSchema.pre("save", async function () {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString("hex");
  }
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
