const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getPayanaWayPage,
  updateAJourneyBegins,
  updateThePayanaDifference,
  updateJourneysWithPurpose,
  updateInTheMedia,
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

router.put(
  "/in-the-media",
  requireAdmin,
  upload.any(), // dynamic field names like itemImage_0
  updateInTheMedia
);

module.exports = router;
