const LegalSection = require("../models/LegalSection");

const VALID_TYPES = ["privacy-policy", "terms-and-conditions"];

/**
 * Validates that the :type param is one of the allowed legal page types.
 */
const validateType = (type) => VALID_TYPES.includes(type);

/**
 * GET /api/legal-sections/:type
 * Returns legal sections for the requested type.
 * Optional query parameter ?admin=true returns all sections.
 * Otherwise returns only active sections.
 */
exports.getLegalSections = async (req, res) => {
  try {
    const { type } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal section type" });
    }

    const { admin } = req.query;
    const query = { type };

    if (admin !== "true") {
      query.isActive = true;
    }

    const sections = await LegalSection.find(query).sort({ order: 1 });
    res.status(200).json(sections);
  } catch (error) {
    console.error("Error fetching legal sections:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * POST /api/legal-sections/:type
 * Create a new legal section.
 */
exports.createLegalSection = async (req, res) => {
  try {
    const { type } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal section type" });
    }

    const { heading, content, isActive } = req.body;

    const count = await LegalSection.countDocuments({ type });

    const newSection = new LegalSection({
      type,
      heading,
      content,
      order: count, // Append to the end
      isActive: isActive !== undefined ? isActive : true,
    });

    await newSection.save();
    res.status(201).json({ message: "Legal section created successfully", section: newSection });
  } catch (error) {
    console.error("Error creating legal section:", error);
    res.status(500).json({ message: "Failed to create legal section", error: error.message });
  }
};

/**
 * PUT /api/legal-sections/:type/:id
 * Update an existing legal section.
 */
exports.updateLegalSection = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal section type" });
    }

    const { heading, content, isActive } = req.body;

    const updatedSection = await LegalSection.findOneAndUpdate(
      { _id: id, type },
      { heading, content, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({ message: "Legal section not found" });
    }

    res.status(200).json({ message: "Legal section updated successfully", section: updatedSection });
  } catch (error) {
    console.error("Error updating legal section:", error);
    res.status(500).json({ message: "Failed to update legal section", error: error.message });
  }
};

/**
 * DELETE /api/legal-sections/:type/:id
 * Delete a legal section.
 */
exports.deleteLegalSection = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal section type" });
    }

    const deletedSection = await LegalSection.findOneAndDelete({ _id: id, type });

    if (!deletedSection) {
      return res.status(404).json({ message: "Legal section not found" });
    }

    res.status(200).json({ message: "Legal section deleted successfully" });
  } catch (error) {
    console.error("Error deleting legal section:", error);
    res.status(500).json({ message: "Failed to delete legal section", error: error.message });
  }
};

/**
 * PUT /api/legal-sections/:type/reorder
 * Bulk update the order of legal sections.
 */
exports.reorderLegalSections = async (req, res) => {
  try {
    const { type } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal section type" });
    }

    // Expecting an array of objects: [{ id: "...", order: 0 }, { id: "...", order: 1 }]
    const payload = req.body;

    if (!Array.isArray(payload)) {
      return res.status(400).json({ message: "Invalid payload format" });
    }

    // Update each document's order concurrently
    const updates = payload.map((item) =>
      LegalSection.findOneAndUpdate(
        { _id: item.id, type },
        { order: item.order },
        { new: true }
      )
    );

    await Promise.all(updates);

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error reordering legal sections:", error);
    res.status(500).json({ message: "Failed to reorder legal sections", error: error.message });
  }
};

/**
 * PATCH /api/legal-sections/:type/:id/toggle
 * Toggle the isActive status of a legal section.
 */
exports.toggleLegalSectionStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!validateType(type)) {
      return res.status(400).json({ message: "Invalid legal section type" });
    }

    const section = await LegalSection.findOne({ _id: id, type });

    if (!section) {
      return res.status(404).json({ message: "Legal section not found" });
    }

    section.isActive = !section.isActive;
    await section.save();

    res.status(200).json({ message: "Status toggled successfully", isActive: section.isActive });
  } catch (error) {
    console.error("Error toggling legal section status:", error);
    res.status(500).json({ message: "Failed to toggle status", error: error.message });
  }
};
