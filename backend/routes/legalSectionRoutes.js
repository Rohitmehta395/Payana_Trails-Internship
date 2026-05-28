const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middlewares/adminAuth");

const {
  getLegalSections,
  createLegalSection,
  updateLegalSection,
  deleteLegalSection,
  reorderLegalSections,
  toggleLegalSectionStatus,
} = require("../controllers/legalSectionController");

// ─── Legal Section Routes ───────────────────────────────────────────────────
// :type is validated inside each controller to be "privacy-policy" or "terms-and-conditions"

// Public
router.get("/:type", getLegalSections);

// Admin
router.post("/:type", requireAdmin, createLegalSection);
router.put("/:type/reorder", requireAdmin, reorderLegalSections); // Order matters, define before /:id
router.put("/:type/:id", requireAdmin, updateLegalSection);
router.delete("/:type/:id", requireAdmin, deleteLegalSection);
router.patch("/:type/:id/toggle", requireAdmin, toggleLegalSectionStatus);

module.exports = router;
