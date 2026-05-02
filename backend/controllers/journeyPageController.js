const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const JourneyPage = require("../models/JourneyPage");

// ─── Upload folder helpers ────────────────────────────────────────────────────

const trailsUploadsFolder = path.join(
  __dirname,
  "..",
  "uploads",
  "journey",
  "ourTrails"
);

const payanaWayUploadsFolder = path.join(
  __dirname,
  "..",
  "uploads",
  "journey",
  "payanaWay"
);

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const deleteFile = (filePath, folder) => {
  if (!filePath) return;
  const fileName = filePath.split("/").pop();
  const fp = path.join(folder, fileName);
  fs.unlink(fp, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to delete old image:", err.message);
    }
  });
};

const compressImage = async (buffer, { width = 800, quality = 80 } = {}) => {
  return sharp(buffer)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
};

// ─── Default page factory ────────────────────────────────────────────────────

const getOrCreatePage = async () => {
  let page = await JourneyPage.findOne();
  if (!page) {
    page = await JourneyPage.create({
      hero: {
        miniTitle: "Explore Our World",
        mainTitle: "JOURNEYS THAT STAY,\nLONG AFTER YOU RETURN",
        subtitle:
          "Trails designed for those who value depth over distance – shaped by stories, places and experiences that stay with you.",
      },
      signatureJourneys: {
        mainTitle: "Signature Journeys",
        subtitle:
          "Discover our carefully curated experiences, blending rich heritage, immersive culture, breathtaking landscapes and unforgettable wildlife encounters.",
      },
      ourTrails: {
        containerTitle: "Trail Collections",
        mainTitle: "Our Trails",
        subtitle:
          "Choose your path. Whether you seek the thrill of the wild, the echoes of history, or the heartbeat of local communities, we have a journey for you.",
        trails: [
          { title: "Wildlife Trails", iconImage: "" },
          { title: "Heritage Trails", iconImage: "" },
          { title: "Cultural & Immersive Trails", iconImage: "" },
        ],
      },
      ourDestinations: {
        mainTitle: "Our Destinations",
        subtitle:
          "The world is full of wonders waiting to be explored. Our handpicked destinations offer a gateway to extraordinary experiences.",
      },
      payanaJourney: {
        italicText: "Every Payana journey\nis carefully designed",
        normalText:
          "to balance exploration with comfort and time to absorb the landscape.",
        image: "",
      },
    });
  }

  // Ensure trails array always has exactly 3 items
  if (!page.ourTrails.trails || page.ourTrails.trails.length < 3) {
    const defaults = [
      { title: "Wildlife Trails", iconImage: "" },
      { title: "Heritage Trails", iconImage: "" },
      { title: "Cultural & Immersive Trails", iconImage: "" },
    ];
    const existing = page.ourTrails.trails || [];
    while (existing.length < 3) {
      existing.push(defaults[existing.length]);
    }
    page.ourTrails.trails = existing;
    await page.save();
  }

  // ── Migrate: ensure italicText uses \n to separate non-italic / italic parts ──
  // If the stored value is the old flat string (no newline), update it in place.
  const LEGACY_ITALIC = "Every Payana journey is carefully designed";
  const MIGRATED_ITALIC = "Every Payana journey\nis carefully designed";
  if (page.payanaJourney.italicText === LEGACY_ITALIC) {
    page.payanaJourney.italicText = MIGRATED_ITALIC;
    await page.save();
  }

  return page;
};

// ─── GET Journey Page ────────────────────────────────────────────────────────

exports.getJourneyPage = async (req, res) => {
  try {
    const page = await getOrCreatePage();
    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching Journey page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE Hero Section ─────────────────────────────────────────────────────

exports.updateHeroSection = async (req, res) => {
  try {
    const page = await getOrCreatePage();
    const { miniTitle, mainTitle, subtitle } = req.body;

    if (miniTitle !== undefined) page.hero.miniTitle = miniTitle;
    if (mainTitle !== undefined) page.hero.mainTitle = mainTitle;
    if (subtitle !== undefined) page.hero.subtitle = subtitle;

    await page.save();
    res.status(200).json({ message: "Hero section updated successfully", page });
  } catch (error) {
    console.error("Error updating Hero section:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE Signature Journeys Section ───────────────────────────────────────

exports.updateSignatureJourneysSection = async (req, res) => {
  try {
    const page = await getOrCreatePage();
    const { mainTitle, subtitle } = req.body;

    if (mainTitle !== undefined) page.signatureJourneys.mainTitle = mainTitle;
    if (subtitle !== undefined) page.signatureJourneys.subtitle = subtitle;

    await page.save();
    res
      .status(200)
      .json({ message: "Signature Journeys section updated successfully", page });
  } catch (error) {
    console.error("Error updating Signature Journeys section:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE Our Trails Section ───────────────────────────────────────────────

exports.updateOurTrailsSection = async (req, res) => {
  try {
    const page = await getOrCreatePage();
    const { containerTitle, mainTitle, subtitle, trailsData } = req.body;

    if (containerTitle !== undefined)
      page.ourTrails.containerTitle = containerTitle;
    if (mainTitle !== undefined) page.ourTrails.mainTitle = mainTitle;
    if (subtitle !== undefined) page.ourTrails.subtitle = subtitle;

    let trails = [];
    if (trailsData) {
      trails = JSON.parse(trailsData);
    } else {
      trails = page.ourTrails.trails.map((t) => ({
        title: t.title,
        iconImage: t.iconImage,
      }));
    }

    const files = req.files || {};
    const imageStats = [];

    ensureDir(trailsUploadsFolder);

    for (let i = 0; i < trails.length; i++) {
      const fieldName = `trailIcon_${i}`;
      let file = null;
      if (Array.isArray(files)) {
        file = files.find((f) => f.fieldname === fieldName);
      } else if (files[fieldName] && files[fieldName][0]) {
        file = files[fieldName][0];
      }

      if (file) {
        // Delete old image if it exists
        const oldIconImage = page.ourTrails.trails[i]
          ? page.ourTrails.trails[i].iconImage
          : "";
        if (oldIconImage) {
          deleteFile(oldIconImage, trailsUploadsFolder);
        }

        const baseName = `trail-icon-${i}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`;
        const webpFilename = `${baseName}.webp`;
        const destPath = path.join(trailsUploadsFolder, webpFilename);

        const compressedBuffer = await compressImage(file.buffer, {
          width: 400,
          quality: 85,
        });
        fs.writeFileSync(destPath, compressedBuffer);

        const originalSize = file.size || file.buffer?.length || 0;
        const compressedSize = compressedBuffer.length;

        imageStats.push({
          field: `Trail ${i + 1} Icon`,
          originalName: file.originalname,
          originalSize,
          compressedSize,
          savedPercent:
            originalSize > 0
              ? Math.round((1 - compressedSize / originalSize) * 100)
              : 0,
        });

        trails[i].iconImage = `/uploads/journey/ourTrails/${webpFilename}`;
      } else {
        // Keep existing icon image if no new file uploaded
        if (page.ourTrails.trails[i] && page.ourTrails.trails[i].iconImage) {
          trails[i].iconImage = page.ourTrails.trails[i].iconImage;
        }
      }
    }

    page.ourTrails.trails = trails;
    await page.save();

    res.status(200).json({
      message: "Our Trails section updated successfully",
      page,
      imageStats,
    });
  } catch (error) {
    console.error("Error updating Our Trails section:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE Our Destinations Section ─────────────────────────────────────────

exports.updateOurDestinationsSection = async (req, res) => {
  try {
    const page = await getOrCreatePage();
    const { mainTitle, subtitle } = req.body;

    if (mainTitle !== undefined) page.ourDestinations.mainTitle = mainTitle;
    if (subtitle !== undefined) page.ourDestinations.subtitle = subtitle;

    await page.save();
    res.status(200).json({
      message: "Our Destinations section updated successfully",
      page,
    });
  } catch (error) {
    console.error("Error updating Our Destinations section:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE Payana Journey Section ───────────────────────────────────────────

exports.updatePayanaJourneySection = async (req, res) => {
  try {
    const page = await getOrCreatePage();
    const { italicText, normalText } = req.body;

    if (italicText !== undefined) page.payanaJourney.italicText = italicText;
    if (normalText !== undefined) page.payanaJourney.normalText = normalText;

    const files = req.files || {};
    const imageStats = [];

    ensureDir(payanaWayUploadsFolder);

    const imageFile = (files.image || [])[0];
    if (imageFile) {
      // Delete old image
      if (page.payanaJourney.image) {
        deleteFile(page.payanaJourney.image, payanaWayUploadsFolder);
      }

      const baseName = `payana-journey-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const webpFilename = `${baseName}.webp`;
      const destPath = path.join(payanaWayUploadsFolder, webpFilename);

      const compressedBuffer = await compressImage(imageFile.buffer, {
        width: 2000,
        quality: 82,
      });
      fs.writeFileSync(destPath, compressedBuffer);

      const originalSize = imageFile.size || imageFile.buffer?.length || 0;
      const compressedSize = compressedBuffer.length;

      imageStats.push({
        field: "Payana Journey Image",
        originalName: imageFile.originalname,
        originalSize,
        compressedSize,
        savedPercent:
          originalSize > 0
            ? Math.round((1 - compressedSize / originalSize) * 100)
            : 0,
      });

      page.payanaJourney.image = `/uploads/journey/payanaWay/${webpFilename}`;
    }

    await page.save();
    res.status(200).json({
      message: "Payana Journey section updated successfully",
      page,
      imageStats,
    });
  } catch (error) {
    console.error("Error updating Payana Journey section:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
