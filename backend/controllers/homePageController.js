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
      
      if (data.testimonials && currentData.testimonials) {
        data.testimonials.images = currentData.testimonials.images;
      } else if (!data.testimonials && currentData.testimonials) {
        data.testimonials = currentData.testimonials;
      }
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

const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const HomePage = require("../models/HomePage");

const testimonialsFolder = path.join(__dirname, "..", "uploads", "homePage", "testimonials");

exports.uploadTestimonials = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided." });
    }

    if (!fs.existsSync(testimonialsFolder)) fs.mkdirSync(testimonialsFolder, { recursive: true });

    let homePage = await HomePage.findOne();
    if (!homePage) {
      homePage = new HomePage();
    }
    if (!homePage.testimonials) {
      homePage.testimonials = { images: [] };
    }

    const startOrder = homePage.testimonials.images.length;
    const imageStats = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const baseName = `testimonial-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const webpFilename = `${baseName}.webp`;
      const destPath = path.join(testimonialsFolder, webpFilename);

      const compressedBuffer = await sharp(file.buffer)
        .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      fs.writeFileSync(destPath, compressedBuffer);

      const originalSize = file.size || file.buffer?.length || 0;
      const compressedSize = compressedBuffer.length;
      
      imageStats.push({
        variant: "desktop",
        originalName: file.originalname,
        originalSize,
        compressedSize,
        savedPercent: originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0,
      });

      homePage.testimonials.images.push({
        url: `/uploads/homePage/testimonials/${webpFilename}`,
        alt: req.body.alt || "",
        isActive: true,
        order: startOrder + i,
      });
    }

    await homePage.save();
    res.status(201).json({ page: homePage, imageStats });
  } catch (error) {
    console.error("Error uploading testimonials:", error);
    res.status(500).json({ message: "Failed to upload testimonials", error: error.message });
  }
};

exports.reorderTestimonials = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds must be an array" });
    }

    const homePage = await HomePage.findOne();
    if (!homePage || !homePage.testimonials) {
      return res.status(404).json({ message: "Home page testimonials not found" });
    }

    const imageMap = {};
    homePage.testimonials.images.forEach((img) => { imageMap[img._id.toString()] = img; });
    
    const reordered = orderedIds
      .filter((id) => imageMap[id])
      .map((id, index) => { const img = imageMap[id]; img.order = index; return img; });

    homePage.testimonials.images = reordered;
    await homePage.save();
    res.json({ page: homePage });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder testimonials", error: error.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { imageId } = req.params;
    const homePage = await HomePage.findOne();
    if (!homePage || !homePage.testimonials) {
      return res.status(404).json({ message: "Home page testimonials not found" });
    }

    const imgEntry = homePage.testimonials.images.id(imageId);
    if (!imgEntry) return res.status(404).json({ message: "Image not found" });

    if (imgEntry.url) {
      const fileName = imgEntry.url.split("/").pop();
      const fp = path.join(testimonialsFolder, fileName);
      fs.unlink(fp, (e) => {
        if (e && e.code !== "ENOENT") console.error("Failed to delete testimonial image file:", e.message);
      });
    }

    homePage.testimonials.images.pull(imageId);
    homePage.testimonials.images.forEach((img, i) => { img.order = i; });
    await homePage.save();

    res.json({ message: "Testimonial deleted successfully", page: homePage });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete testimonial", error: error.message });
  }
};

