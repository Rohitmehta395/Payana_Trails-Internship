const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const { requireAdmin } = require("../middlewares/adminAuth");

// Public routes (or admin query logic handled locally)
router.get("/", faqController.getFAQs);

// Protected Admin Routes
router.post("/", requireAdmin, faqController.createFAQ);
router.put("/reorder", requireAdmin, faqController.reorderFAQs); // Place before /:id to prevent matching issues
router.put("/:id", requireAdmin, faqController.updateFAQ);
router.patch("/:id/toggle", requireAdmin, faqController.toggleFAQStatus);
router.delete("/:id", requireAdmin, faqController.deleteFAQ);

module.exports = router;
