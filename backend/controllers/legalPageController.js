const LegalPage = require("../models/LegalPage");

const VALID_TYPES = ["privacy-policy", "terms-and-conditions"];

const DEFAULT_TITLES = {
  "privacy-policy": "Privacy Policy",
  "terms-and-conditions": "Terms & Conditions",
};

/**
 * Validates that the :type param is one of the allowed legal page types.
 */
const validateType = (type) => VALID_TYPES.includes(type);

// ─── Public ──────────────────────────────────────────────────────────────────

/**
 * GET /api/legal/:type
 * Public. Returns published content for the requested legal page.
 */
exports.getLegalPage = async (req, res) => {
  try {
    const { type } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal page type" });
    }

    const page = await LegalPage.findOne({ type }).select("-draftData");

    if (!page || page.isDraft) {
      // Return a minimal object so the frontend can show a "no content" state
      return res.status(200).json({
        type,
        title: DEFAULT_TITLES[type],
        content: "",
        isDraft: true,
        lastPublishedAt: null,
      });
    }

    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching legal page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Admin ───────────────────────────────────────────────────────────────────

/**
 * GET /api/legal/:type/admin
 * Admin. Returns the full legal page document including draftData.
 */
exports.getLegalPageAdmin = async (req, res) => {
  try {
    const { type } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal page type" });
    }

    let page = await LegalPage.findOne({ type });

    if (!page) {
      // Return a default skeleton so the admin editor has something to work with
      return res.status(200).json({
        type,
        title: DEFAULT_TITLES[type],
        content: "",
        isDraft: true,
        draftData: null,
        lastPublishedAt: null,
      });
    }

    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching admin legal page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * PUT /api/legal/:type
 * Admin. Create or update a legal page (publish or save as draft).
 */
exports.upsertLegalPage = async (req, res) => {
  try {
    const { type } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal page type" });
    }

    const { title, content, isDraft } = req.body;

    let page = await LegalPage.findOne({ type });

    if (!page) {
      page = new LegalPage({ type });
    }

    if (title !== undefined) page.title = title;
    if (content !== undefined) page.content = content;

    const savingAsDraft = isDraft === true || isDraft === "true";
    page.isDraft = savingAsDraft;

    // Clear draft data on explicit save (both draft and publish)
    page.draftData = null;

    // Track publish timestamp
    if (!savingAsDraft) {
      page.lastPublishedAt = new Date();
    }

    await page.save();

    const action = savingAsDraft ? "Draft saved" : "Published";
    res.status(200).json({ message: `${action} successfully`, page });
  } catch (error) {
    console.error("Error upserting legal page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * PATCH /api/legal/:type/autosave
 * Admin. Autosave draft data without changing the published content.
 */
exports.autosaveLegalPage = async (req, res) => {
  try {
    const { type } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal page type" });
    }

    const { draftData } = req.body;

    let page = await LegalPage.findOne({ type });

    if (!page) {
      // Auto-create the document on first autosave
      page = new LegalPage({
        type,
        title: DEFAULT_TITLES[type],
        isDraft: true,
      });
    }

    page.draftData = draftData;
    await page.save();

    res.status(200).json({ message: "Autosaved", page });
  } catch (error) {
    console.error("Error autosaving legal page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
