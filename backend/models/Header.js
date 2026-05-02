const mongoose = require("mongoose");

const headerSchema = new mongoose.Schema(
  {
    logo: { type: String, required: false, default: null },
    siteName: { type: String, required: false, default: "Payana Trails" },
    navLabels: {
      home:       { type: String, required: true, default: "Home" },
      journey:    { type: String, required: true, default: "Journey" },
      payanaWay:  { type: String, required: true, default: "Payana Way" },
      stories:    { type: String, required: true, default: "Stories" },
      connect:    { type: String, required: true, default: "Connect" },
    },
    mobileNumber: { type: String, required: true, default: "+91 86604 60512" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Header", headerSchema);
