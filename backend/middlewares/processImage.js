const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

/**
 * Dimension presets per field name.
 * Sharp will resize using 'inside' fit (scales to fit within these bounds,
 * never upscaling) so portrait images aren't distorted.
 * heroImage  → 1920 × 1080  (full HD landscape banner)
 * routeMap   → 1200 × 900   (landscape map-friendly)
 * trailImages→ 1200 × 800   (gallery cards)
 */
const RESIZE_PRESETS = {
  heroImage:             { width: 1920, height: 1080 },
  routeMap:              { width: 1200, height: 900  },
  trailImages:           { width: 1920, height: 1080 },
  pageHeroImages:        { width: 1920, height: 1080 }, // Page hero – desktop landscape
  pageHeroImagesMobile:  { width: 768,  height: 1024 }, // Page hero – mobile portrait
  thePayanaWayHeroImage: { width: 1920, height: 1080 },
  storiesHeroImage:      { width: 1920, height: 1080 },
  connectHeroImage:      { width: 1920, height: 1080 },
  referFriendsHeroImage: { width: 1920, height: 1080 },
  giftJourneyHeroImage:  { width: 1920, height: 1080 },
  enquiryLeftImage:      { width: 1920, height: 1080 },
  enquiryRightImage:     { width: 1920, height: 1080 },
  referFriendImage:      { width: 1920, height: 1080 },
  giftJourneyImage:      { width: 1920, height: 1080 },
};

const isProcessableImageField = (fieldname) => Boolean(RESIZE_PRESETS[fieldname]);

const buildSharpPipeline = (file, fieldname) => {
  let pipeline = sharp(file.buffer);
  const preset = RESIZE_PRESETS[fieldname];

  if (preset) {
    pipeline = pipeline.resize(preset.width, preset.height, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  return pipeline.webp({ quality: 80 });
};

const buildImageStat = (file, fieldname, compressedSize) => {
  const originalSize = file.size || file.buffer?.length || 0;
  const savedPercent = originalSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return {
    field: fieldname,
    originalName: file.originalname,
    originalSize,
    compressedSize,
    savedPercent,
    savedBytes: originalSize - compressedSize,
  };
};

const getCompressedImageBuffer = async (file, fieldname) => {
  return buildSharpPipeline(file, fieldname).toBuffer();
};

const getImageStats = async (files = {}) => {
  const stats = [];

  for (const fieldname of Object.keys(files)) {
    if (!isProcessableImageField(fieldname)) continue;

    for (const file of files[fieldname]) {
      const compressedBuffer = await getCompressedImageBuffer(file, fieldname);
      stats.push(buildImageStat(file, fieldname, compressedBuffer.length));
    }
  }

  return stats;
};

/**
 * Safely resolves a stored URL path (e.g. "/uploads/Trails/foo/bar.jpg")
 * to an absolute filesystem path, avoiding the Windows path.join trap
 * where a leading "/" discards the left-hand side.
 *
 * @param {string} storedPath  - The relative URL path stored in MongoDB
 * @returns {string}           - Absolute filesystem path
 */
const resolveUploadPath = (storedPath) => {
  // Strip any leading slash so we can join safely
  const relative = storedPath.replace(/^\/+/, "");
  // Always resolve relative to the backend root regardless of process.cwd().
  // __dirname here is the /middlewares folder, so ".." gets us to /backend.
  return path.join(__dirname, "..", relative);
};

/**
 * processImages(folderResolver)
 *
 * Returns an async Express middleware that:
 *  1. Reads each file buffer from req.files (multer memoryStorage)
 *  2. Resizes the image to its field-specific preset (inside fit, no upscale)
 *  3. Converts to WebP at 80% quality using Sharp
 *  4. Writes the .webp file to the correct upload folder on disk
 *  5. Replaces req.files[field][i] with a diskStorage-compatible object
 *  6. Attaches req.imageStats[] with originalSize / compressedSize / savedPercent
 *     for each processed file so routes can forward this info in the response.
 *
 * @param {Function} folderResolver  (req, fieldname) => string — absolute upload folder path
 */
const processImages = (folderResolver) => async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    }

    // Collect stats for all processed files
    req.imageStats = [];

    for (const fieldname of Object.keys(req.files)) {
      if (!isProcessableImageField(fieldname)) {
        continue;
      }

      const folder = folderResolver(req, fieldname);

      // Ensure the target directory exists
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      const processedFiles = [];

      for (const file of req.files[fieldname]) {
        // Build WebP filename with the same prefix logic as before
        let baseName;
        if (fieldname === "heroImage") {
          baseName = `hero-${Date.now()}`;
        } else if (fieldname === "routeMap") {
          baseName = `routemap-${Date.now()}`;
        } else {
          const originalBase = path.parse(file.originalname).name;
          baseName = `${Date.now()}-${originalBase}`;
        }

        const webpFilename = `${baseName}.webp`;
        const destPath = path.join(folder, webpFilename);

        const compressedBuffer = await getCompressedImageBuffer(file, fieldname);
        fs.writeFileSync(destPath, compressedBuffer);
        const imageStat = buildImageStat(file, fieldname, compressedBuffer.length);

        // Record stats
        req.imageStats.push(imageStat);

        // Mimic diskStorage object so downstream route controllers are unchanged
        processedFiles.push({
          fieldname: file.fieldname,
          originalname: file.originalname,
          encoding: file.encoding,
          mimetype: "image/webp",
          destination: folder,
          filename: webpFilename,
          path: destPath,
          size: compressedBuffer.length,
        });
      }

      req.files[fieldname] = processedFiles;
    }

    next();
  } catch (err) {
    console.error("Image processing error:", err);
    next(err);
  }
};

module.exports = { processImages, resolveUploadPath, getImageStats };
