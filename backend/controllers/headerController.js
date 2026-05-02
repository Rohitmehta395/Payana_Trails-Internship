const headerService = require("../services/headerService");
const { validateHeader } = require("../validators/headerValidator");

exports.getHeader = async (req, res) => {
  try {
    const header = await headerService.getHeader();
    if (!header) {
      return res.status(200).json({});
    }
    res.status(200).json(header);
  } catch (error) {
    console.error("Error fetching header:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateHeader = async (req, res) => {
  try {
    // Parse JSON body if it came as form-data (multipart)
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    const { isValid, errors } = validateHeader(data);
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Preserve existing logo if no new file uploaded
    const currentData = await headerService.getHeader();
    if (currentData) {
      data.logo = currentData.logo;
    }

    // Process the uploaded logo image (if any)
    if (req.files && req.files.headerLogo && req.files.headerLogo.length > 0) {
      // Delete the old logo before replacing
      if (data.logo) {
        headerService.deleteOldImage(data.logo);
      }
      data.logo = `/uploads/header/${req.files.headerLogo[0].filename}`;
    }

    const updatedHeader = await headerService.updateHeader(data);
    res.status(200).json(updatedHeader);
  } catch (error) {
    console.error("Error updating header:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteLogo = async (req, res) => {
  try {
    const header = await headerService.getHeader();
    if (header && header.logo) {
      headerService.deleteOldImage(header.logo);
      header.logo = null;
      await header.save();
    }
    res.status(200).json(header || {});
  } catch (error) {
    console.error("Error deleting header logo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

