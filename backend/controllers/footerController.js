const footerService = require("../services/footerService");

exports.getFooter = async (req, res) => {
  try {
    const footer = await footerService.getFooter();
    if (!footer) {
      return res.status(200).json({});
    }
    res.status(200).json(footer);
  } catch (error) {
    console.error("Error fetching footer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    // Parse JSON body if it came as form-data (multipart)
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    // Remove immutable fields that might be sent from frontend
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;

    // Preserve existing logo if no new file uploaded
    const currentData = await footerService.getFooter();
    if (currentData && !data.logo) {
      data.logo = currentData.logo;
    }

    // Process the uploaded logo image (if any)
    if (req.files && req.files.footerLogo && req.files.footerLogo.length > 0) {
      // Delete the old logo before replacing
      if (currentData && currentData.logo) {
        footerService.deleteOldImage(currentData.logo);
      }
      data.logo = `/uploads/footer/${req.files.footerLogo[0].filename}`;
    }

    const updatedFooter = await footerService.updateFooter(data);
    res.status(200).json(updatedFooter);
  } catch (error) {
    console.error("Error updating footer:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
    });
  }
};

exports.deleteLogo = async (req, res) => {
  try {
    const footer = await footerService.getFooter();
    if (footer && footer.logo) {
      footerService.deleteOldImage(footer.logo);
      footer.logo = null;
      await footer.save();
    }
    res.status(200).json(footer || {});
  } catch (error) {
    console.error("Error deleting footer logo:", error);
    res.status(500).json({ message: "Server error" });
  }
};
