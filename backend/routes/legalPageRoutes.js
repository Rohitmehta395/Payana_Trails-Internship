const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middlewares/adminAuth");

const {
  getLegalPage,
  getLegalPageAdmin,
  upsertLegalPage,
  autosaveLegalPage,
} = require("../controllers/legalPageController");

// ─── Legal Page Routes ───────────────────────────────────────────────────────
// :type is validated inside each controller to be "privacy-policy" or "terms-and-conditions"

// Public
router.get("/:type", getLegalPage);

// Admin
router.get("/:type/admin", requireAdmin, getLegalPageAdmin);
router.put("/:type", requireAdmin, upsertLegalPage);
router.patch("/:type/autosave", requireAdmin, autosaveLegalPage);

module.exports = router;
