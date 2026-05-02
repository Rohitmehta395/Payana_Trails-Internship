const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getJourneyPage,
  updateHeroSection,
  updateSignatureJourneysSection,
  updateOurTrailsSection,
  updateOurDestinationsSection,
  updatePayanaJourneySection,
} = require("../controllers/journeyPageController");
const { requireAdmin } = require("../middlewares/adminAuth");

// Use memory storage for sharp processing
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// GET /api/journey-page — Public
router.get("/", getJourneyPage);

// PUT /api/journey-page/hero — Admin
router.put("/hero", requireAdmin, updateHeroSection);

// PUT /api/journey-page/signature-journeys — Admin
router.put(
  "/signature-journeys",
  requireAdmin,
  updateSignatureJourneysSection
);

// PUT /api/journey-page/our-trails — Admin (dynamic field names for trail icons)
router.put("/our-trails", requireAdmin, upload.any(), updateOurTrailsSection);

// PUT /api/journey-page/our-destinations — Admin
router.put("/our-destinations", requireAdmin, updateOurDestinationsSection);

// PUT /api/journey-page/payana-journey — Admin
router.put(
  "/payana-journey",
  requireAdmin,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updatePayanaJourneySection
);

module.exports = router;
