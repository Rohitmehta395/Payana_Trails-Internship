const mongoose = require("mongoose");
const { DESTINATION_GEOGRAPHIES } = require("../constants/destinationGeographies");

const destinationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    name: {
      type: String,
      required: function() { return this.status === 'published'; },
      unique: true,
      trim: true,
    },
    geography: {
      type: String,
      required: function() { return this.status === 'published'; },
      enum: DESTINATION_GEOGRAPHIES,
      trim: true,
    },
    heroImage: {
      type: String, // Path to the uploaded image
      required: function() { return this.status === 'published'; },
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: function() {
        return this.status !== 'draft';
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
