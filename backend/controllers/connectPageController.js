const connectPageService = require("../services/connectPageService");
const { validateConnectPage } = require("../validators/connectPageValidator");

exports.getConnectPage = async (req, res) => {
  try {
    const connectPage = await connectPageService.getConnectPage();
    if (!connectPage) {
      return res.status(200).json({});
    }
    res.status(200).json(connectPage);
  } catch (error) {
    console.error("Error fetching connect page:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateConnectPage = async (req, res) => {
  try {
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    const { isValid, errors } = validateConnectPage(data);
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const currentData = await connectPageService.getConnectPage();

    // Assign existing images if not updated
    if (currentData) {
      if (data.enquirySection) {
        data.enquirySection.leftImage = currentData.enquirySection?.leftImage;
        data.enquirySection.rightImage = currentData.enquirySection?.rightImage;
      }
      if (data.referFriendSection) {
        data.referFriendSection.image = currentData.referFriendSection?.image;
      }
      if (data.giftJourneySection) {
        data.giftJourneySection.image = currentData.giftJourneySection?.image;
      }
    }

    // Process new images
    if (req.files) {
      if (req.files.enquiryLeftImage && req.files.enquiryLeftImage.length > 0) {
        if (data.enquirySection?.leftImage) connectPageService.deleteOldImage(data.enquirySection.leftImage);
        data.enquirySection.leftImage = `/uploads/connect/${req.files.enquiryLeftImage[0].filename}`;
      }
      if (req.files.enquiryRightImage && req.files.enquiryRightImage.length > 0) {
        if (data.enquirySection?.rightImage) connectPageService.deleteOldImage(data.enquirySection.rightImage);
        data.enquirySection.rightImage = `/uploads/connect/${req.files.enquiryRightImage[0].filename}`;
      }
      if (req.files.referFriendImage && req.files.referFriendImage.length > 0) {
        if (data.referFriendSection?.image) connectPageService.deleteOldImage(data.referFriendSection.image);
        data.referFriendSection.image = `/uploads/connect/${req.files.referFriendImage[0].filename}`;
      }
      if (req.files.giftJourneyImage && req.files.giftJourneyImage.length > 0) {
        if (data.giftJourneySection?.image) connectPageService.deleteOldImage(data.giftJourneySection.image);
        data.giftJourneySection.image = `/uploads/connect/${req.files.giftJourneyImage[0].filename}`;
      }
    }

    const updatedConnectPage = await connectPageService.updateConnectPage(data);
    res.status(200).json(updatedConnectPage);
  } catch (error) {
    console.error("Error updating connect page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
