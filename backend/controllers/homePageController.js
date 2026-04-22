const homePageService = require("../services/homePageService");
const { validateHomePage } = require("../validators/homePageValidator");

exports.getHomePage = async (req, res) => {
  try {
    const homePage = await homePageService.getHomePage();
    if (!homePage) {
      return res.status(200).json({});
    }
    res.status(200).json(homePage);
  } catch (error) {
    console.error("Error fetching home page:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateHomePage = async (req, res) => {
  try {
    // Parse the data if it comes as JSON string in form-data
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    const { isValid, errors } = validateHomePage(data);
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const currentData = await homePageService.getHomePage();

    // Assign existing images if not updated
    if (currentData) {
      data.thePayanaWay.heroImage = currentData.thePayanaWay?.heroImage;
      data.storiesAndVoices.heroImage = currentData.storiesAndVoices?.heroImage;
      data.connectSection.heroImage = currentData.connectSection?.heroImage;
      data.referAndGiftSection.referYourFriends.heroImage = currentData.referAndGiftSection?.referYourFriends?.heroImage;
      data.referAndGiftSection.giftAJourney.heroImage = currentData.referAndGiftSection?.giftAJourney?.heroImage;
    }

    // Process new images
    if (req.files) {
      if (req.files.thePayanaWayHeroImage && req.files.thePayanaWayHeroImage.length > 0) {
        if (data.thePayanaWay.heroImage) homePageService.deleteOldImage(data.thePayanaWay.heroImage);
        data.thePayanaWay.heroImage = `/uploads/homePage/thePayanaWay/${req.files.thePayanaWayHeroImage[0].filename}`;
      }
      if (req.files.storiesHeroImage && req.files.storiesHeroImage.length > 0) {
        if (data.storiesAndVoices.heroImage) homePageService.deleteOldImage(data.storiesAndVoices.heroImage);
        data.storiesAndVoices.heroImage = `/uploads/homePage/storiesVoices/${req.files.storiesHeroImage[0].filename}`;
      }
      if (req.files.connectHeroImage && req.files.connectHeroImage.length > 0) {
        if (data.connectSection.heroImage) homePageService.deleteOldImage(data.connectSection.heroImage);
        data.connectSection.heroImage = `/uploads/homePage/connect/${req.files.connectHeroImage[0].filename}`;
      }
      if (req.files.referFriendsHeroImage && req.files.referFriendsHeroImage.length > 0) {
        if (data.referAndGiftSection.referYourFriends.heroImage) homePageService.deleteOldImage(data.referAndGiftSection.referYourFriends.heroImage);
        data.referAndGiftSection.referYourFriends.heroImage = `/uploads/homePage/referFriends/${req.files.referFriendsHeroImage[0].filename}`;
      }
      if (req.files.giftJourneyHeroImage && req.files.giftJourneyHeroImage.length > 0) {
        if (data.referAndGiftSection.giftAJourney.heroImage) homePageService.deleteOldImage(data.referAndGiftSection.giftAJourney.heroImage);
        data.referAndGiftSection.giftAJourney.heroImage = `/uploads/homePage/giftJourney/${req.files.giftJourneyHeroImage[0].filename}`;
      }
    }

    const updatedHomePage = await homePageService.updateHomePage(data);
    res.status(200).json(updatedHomePage);
  } catch (error) {
    console.error("Error updating home page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
