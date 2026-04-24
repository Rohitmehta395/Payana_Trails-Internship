const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getPayanaWayPage,
  updateAJourneyBegins,
  updateThePayanaDifference,
  updateJourneysWithPurpose,
} = require("../controllers/payanaWayController");
const { requireAdmin } = require("../middlewares/adminAuth");

// Use memory storage for sharp processing
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.get("/", getPayanaWayPage);

router.put(
  "/a-journey-begins",
  requireAdmin,
  upload.fields([
    { name: "adminImage", maxCount: 1 },
    { name: "signatureImage", maxCount: 1 },
  ]),
  updateAJourneyBegins
);

// PUT /api/payana-way/the-payana-difference - Update "The Payana Difference" section
router.put(
  "/the-payana-difference",
  requireAdmin,
  upload.fields([{ name: "mainImage", maxCount: 1 }]),
  updateThePayanaDifference
);

router.put(
  "/journeys-with-purpose",
  requireAdmin,
  upload.any(), // since we use dynamic field names like blockImage_0
  updateJourneysWithPurpose
);

module.exports = router;
