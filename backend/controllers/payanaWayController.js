const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const PayanaWayPage = require("../models/PayanaWayPage");

const uploadsFolder = path.join(__dirname, "..", "uploads", "payanaWay", "aJourneyBegins");
const diffUploadsFolder = path.join(__dirname, "..", "uploads", "payanaWay", "thePayanaDifference");

// Helper to delete old image
const deleteOldImage = (imagePath) => {
  if (imagePath) {
    const fileName = imagePath.split("/").pop();
    const fp = path.join(uploadsFolder, fileName);
    fs.unlink(fp, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Failed to delete old image:", err.message);
      }
    });
  }
};

exports.getPayanaWayPage = async (req, res) => {
  try {
    let page = await PayanaWayPage.findOne();
    if (!page) {
      page = await PayanaWayPage.create({
        aJourneyBegins: {
          adminImage: "",
          description: "",
          paragraph: "",
          name: "",
          occupation: "",
          signatureImage: "",
        },
        thePayanaDifference: {
          mainImage: "",
          entries: [],
        },
        journeysWithPurpose: {
          mainTitle: "Journeys with Purpose",
          subtitle: "Journeys that enrich you, while leaving a positive difference behind.",
          blocks: [],
        },
      });
    }
    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching Payana Way page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateAJourneyBegins = async (req, res) => {
  try {
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;
    let page = await PayanaWayPage.findOne();
    
    if (!page) {
      page = new PayanaWayPage();
    }

    if (!page.aJourneyBegins) {
      page.aJourneyBegins = {};
    }

    // Update text fields
    page.aJourneyBegins.description = data.description || page.aJourneyBegins.description;
    page.aJourneyBegins.paragraph = data.paragraph || page.aJourneyBegins.paragraph;
    page.aJourneyBegins.name = data.name || page.aJourneyBegins.name;
    page.aJourneyBegins.occupation = data.occupation || page.aJourneyBegins.occupation;

    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder, { recursive: true });
    }

    const imageStats = [];

    // Process uploaded images
    if (req.files) {
      if (req.files.adminImage && req.files.adminImage.length > 0) {
        const file = req.files.adminImage[0];
        if (page.aJourneyBegins.adminImage) {
          deleteOldImage(page.aJourneyBegins.adminImage);
        }

        const baseName = `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const webpFilename = `${baseName}.webp`;
        const destPath = path.join(uploadsFolder, webpFilename);

        const compressedBuffer = await sharp(file.buffer)
          .resize(800, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        fs.writeFileSync(destPath, compressedBuffer);

        const originalSize = file.size || file.buffer?.length || 0;
        const compressedSize = compressedBuffer.length;
        
        imageStats.push({
          field: "Admin Image",
          originalName: file.originalname,
          originalSize,
          compressedSize,
          savedPercent: originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0,
        });

        page.aJourneyBegins.adminImage = `/uploads/payanaWay/aJourneyBegins/${webpFilename}`;
      }

      if (req.files.signatureImage && req.files.signatureImage.length > 0) {
        const file = req.files.signatureImage[0];
        if (page.aJourneyBegins.signatureImage) {
          deleteOldImage(page.aJourneyBegins.signatureImage);
        }

        const baseName = `signature-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const webpFilename = `${baseName}.webp`;
        const destPath = path.join(uploadsFolder, webpFilename);

        // Keep signature smaller
        const compressedBuffer = await sharp(file.buffer)
          .resize(400, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        fs.writeFileSync(destPath, compressedBuffer);

        const originalSize = file.size || file.buffer?.length || 0;
        const compressedSize = compressedBuffer.length;
        
        imageStats.push({
          field: "Signature Image",
          originalName: file.originalname,
          originalSize,
          compressedSize,
          savedPercent: originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0,
        });

        page.aJourneyBegins.signatureImage = `/uploads/payanaWay/aJourneyBegins/${webpFilename}`;
      }
    }

    await page.save();
    res.status(200).json({ page, imageStats });
  } catch (error) {
    console.error("Error updating A Journey Begins:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update "The Payana Difference" section
 * @route   PUT /api/payana-way/the-payana-difference
 * @access  Private/Admin
 */
exports.updateThePayanaDifference = async (req, res) => {
  try {
    let page = await PayanaWayPage.findOne();
    if (!page) {
      page = new PayanaWayPage({
        aJourneyBegins: {
          adminImage: "",
          description: "",
          paragraph: "",
          name: "",
          occupation: "",
          signatureImage: "",
        },
        thePayanaDifference: {
          mainImage: "",
          entries: [],
        },
        journeysWithPurpose: {
          mainTitle: "Journeys with Purpose",
          subtitle: "Journeys that enrich you, while leaving a positive difference behind.",
          blocks: [],
        },
      });
    }

    const { entriesData } = req.body;
    let entries = [];
    if (entriesData) {
      entries = JSON.parse(entriesData);
    }

    const files = req.files || {};
    const imageStats = [];

    if (!fs.existsSync(diffUploadsFolder)) {
      fs.mkdirSync(diffUploadsFolder, { recursive: true });
    }

    let newMainImage = page.thePayanaDifference?.mainImage || "";

    if (files.mainImage && files.mainImage[0]) {
      const file = files.mainImage[0];
      
      // Delete old image
      if (page.thePayanaDifference?.mainImage) {
        const oldFileName = page.thePayanaDifference.mainImage.split("/").pop();
        const fp = path.join(diffUploadsFolder, oldFileName);
        fs.unlink(fp, (err) => {
          if (err && err.code !== "ENOENT") console.error("Failed to delete old main image:", err.message);
        });
      }

      const baseName = `main-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const webpFilename = `${baseName}.webp`;
      const destPath = path.join(diffUploadsFolder, webpFilename);

      const compressedBuffer = await sharp(file.buffer)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      fs.writeFileSync(destPath, compressedBuffer);

      const originalSize = file.size || file.buffer?.length || 0;
      const compressedSize = compressedBuffer.length;
      
      imageStats.push({
        field: "Main Image",
        originalName: file.originalname,
        originalSize,
        compressedSize,
        savedPercent: originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0,
      });

      newMainImage = `/uploads/payanaWay/thePayanaDifference/${webpFilename}`;
    }

    page.thePayanaDifference = {
      mainImage: newMainImage,
      entries: entries,
    };

    await page.save();

    res.status(200).json({
      message: "The Payana Difference updated successfully",
      page,
      imageStats,
    });
  } catch (error) {
    console.error("Error updating The Payana Difference:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const journeysUploadsFolder = path.join(__dirname, "..", "uploads", "payanaWay", "journeysWithPurpose");

exports.updateJourneysWithPurpose = async (req, res) => {
  try {
    let page = await PayanaWayPage.findOne();
    if (!page) {
      page = new PayanaWayPage({
        aJourneyBegins: {
          adminImage: "",
          description: "",
          paragraph: "",
          name: "",
          occupation: "",
          signatureImage: "",
        },
        thePayanaDifference: {
          mainImage: "",
          entries: [],
        },
        journeysWithPurpose: {
          mainTitle: "Journeys with Purpose",
          subtitle: "Journeys that enrich you, while leaving a positive difference behind.",
          blocks: [],
        },
      });
    }

    const { mainTitle, subtitle, blocksData } = req.body;
    let blocks = [];
    if (blocksData) {
      blocks = JSON.parse(blocksData);
    }

    if (mainTitle) page.journeysWithPurpose.mainTitle = mainTitle;
    if (subtitle) page.journeysWithPurpose.subtitle = subtitle;

    const files = req.files || {};
    const imageStats = [];

    if (!fs.existsSync(journeysUploadsFolder)) {
      fs.mkdirSync(journeysUploadsFolder, { recursive: true });
    }

    // Process blocks images
    // If a block has image uploaded via files, update it
    for (let i = 0; i < blocks.length; i++) {
      const fieldName = `blockImage_${i}`;
      let file = null;
      if (Array.isArray(files)) {
        file = files.find((f) => f.fieldname === fieldName);
      } else if (files[fieldName] && files[fieldName][0]) {
        file = files[fieldName][0];
      }

      if (file) {
        const baseName = `journey-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const webpFilename = `${baseName}.webp`;
        const destPath = path.join(journeysUploadsFolder, webpFilename);

        const compressedBuffer = await sharp(file.buffer)
          .resize(1200, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        fs.writeFileSync(destPath, compressedBuffer);

        const originalSize = file.size || file.buffer?.length || 0;
        const compressedSize = compressedBuffer.length;
        
        imageStats.push({
          field: `Block Image ${i}`,
          originalName: file.originalname,
          originalSize,
          compressedSize,
          savedPercent: originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0,
        });

        blocks[i].image = `/uploads/payanaWay/journeysWithPurpose/${webpFilename}`;
      }
    }

    // Cleanup old images that are no longer in any blocks
    if (page.journeysWithPurpose && page.journeysWithPurpose.blocks) {
      const oldImages = page.journeysWithPurpose.blocks.map(b => b.image).filter(Boolean);
      const newImages = blocks.map(b => b.image).filter(Boolean);
      oldImages.forEach(oldImg => {
        if (!newImages.includes(oldImg)) {
          const oldFileName = oldImg.split("/").pop();
          const fp = path.join(journeysUploadsFolder, oldFileName);
          fs.unlink(fp, (err) => {
             if (err && err.code !== "ENOENT") console.error("Failed to delete old journey image:", err.message);
          });
        }
      });
    }

    page.journeysWithPurpose.blocks = blocks;

    await page.save();

    res.status(200).json({
      message: "Journeys with Purpose updated successfully",
      page,
      imageStats,
    });
  } catch (error) {
    console.error("Error updating Journeys with Purpose:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

