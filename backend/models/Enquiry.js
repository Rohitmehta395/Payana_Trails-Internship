const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone/whatsapp number"],
      trim: true,
    },
    trailName: {
      type: String,
      required: [true, "Please specify a trail or destination"],
    },
    otherDestination: {
      type: String,
      trim: true,
    },
    travelMonth: {
      type: String,
      required: [true, "Please specify your preferred travel month"],
    },
    travelYear: {
      type: String,
      required: [true, "Please specify your preferred travel year"],
    },
    guests: {
      type: Number,
      required: [true, "Please specify the number of guests"],
      min: [1, "Number of guests must be at least 1"],
    },
    roomPreference: {
      type: String,
      required: [true, "Please specify your room preference"],
      enum: ["Luxury", "Premium", "Standard"],
    },
    connectMethod: {
      type: String,
      required: [true, "Please specify how you would like to connect"],
      enum: ["Phone call", "eMail", "WhatsApp Message", "Google Meet"],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
