const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const PayanaWayPage = require("../models/PayanaWayPage");

const uploadsFolder = path.join(__dirname, "..", "uploads", "payanaWay", "aJourneyBegins");

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
