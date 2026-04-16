const FAQ = require("../models/FAQ");

// Get all FAQs (Public: active only unless ?admin=true)
exports.getFAQs = async (req, res) => {
  try {
    const { admin } = req.query;
    const query = admin === "true" ? {} : { isActive: true };

    const faqs = await FAQ.find(query).sort({ order: 1 });
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, isActive } = req.body;

    // Get the highest order number
    const lastFAQ = await FAQ.findOne().sort({ order: -1 });
    const order = lastFAQ ? lastFAQ.order + 1 : 0;

    const newFAQ = new FAQ({
      question,
      answer,
      isActive: isActive !== undefined ? isActive : true,
      order,
    });

    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ message: "Failed to create FAQ", error: error.message });
  }
};

// Update an existing FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, isActive } = req.body;

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question, answer, isActive },
      { new: true }
    );

    if (!updatedFAQ) return res.status(404).json({ message: "FAQ not found" });

    res.status(200).json(updatedFAQ);
  } catch (error) {
    res.status(500).json({ message: "Failed to update FAQ", error: error.message });
  }
};

// Delete an FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFAQ = await FAQ.findByIdAndDelete(id);

    if (!deletedFAQ) return res.status(404).json({ message: "FAQ not found" });

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete FAQ", error: error.message });
  }
};

// Toggle active status
exports.toggleFAQStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);

    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    faq.isActive = !faq.isActive;
    await faq.save();

    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle FAQ status", error: error.message });
  }
};

// Reorder FAQs
exports.reorderFAQs = async (req, res) => {
  try {
    const { items } = req.body; // Expects an array: [{ id, order }]

    // Update orders sequentially
    const updates = items.map((item) =>
      FAQ.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updates);
    res.status(200).json({ message: "FAQs reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder FAQs", error: error.message });
  }
};
