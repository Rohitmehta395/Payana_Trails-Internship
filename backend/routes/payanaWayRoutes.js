const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getPayanaWayPage, updateAJourneyBegins } = require("../controllers/payanaWayController");

// Use memory storage for sharp processing
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.get("/", getPayanaWayPage);

router.put(
  "/a-journey-begins",
  upload.fields([
    { name: "adminImage", maxCount: 1 },
    { name: "signatureImage", maxCount: 1 },
  ]),
  updateAJourneyBegins
);

module.exports = router;
