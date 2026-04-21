const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PageHeroImage = require("../models/PageHeroImage");
const { PAGE_KEYS } = require("../models/PageHeroImage");
const { resolveUploadPath, getImageStats } = require("../middlewares/processImage");

// memoryStorage so Sharp can intercept buffers before writing
const upload = multer({ storage: multer.memoryStorage() });

// Accept both desktop and mobile field names (up to 20 each)
const cpUpload = upload.fields([
  { name: "pageHeroImages",       maxCount: 20 },
  { name: "pageHeroImagesMobile", maxCount: 20 },
]);

/**
 * Page keys contain forward slashes (e.g. "journeys/wildlife").
 * Express path-to-regexp v8 does NOT support (*)/(.*) syntax in named params.
 * Solution: the frontend URL-encodes "/" as "~"
 *   API URL:  /api/page-heroes/journeys~wildlife/images
 *   DB key:   "journeys/wildlife"
 */
const decode = (raw) => raw.replace(/~/g, "/");

const toAbsoluteUrl = (req, value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const origin = `${req.protocol}://${req.get("host")}`;
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
};

const getPrimaryActiveImage = (images = []) =>
  [...images]
    .filter((img) => img?.isActive && img?.url)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Absolute disk folder for a page + variant. */
const heroFolder = (pageKey, variant = "desktop") => {
  const safeName = pageKey.replace(/\//g, "_");
  const sub = variant === "mobile" ? "Mobile" : "Desktop";
  return path.join(__dirname, "..", "uploads", "PageHeroes", safeName, sub);
};

/** URL base-path for a page + variant. */
const heroBasePath = (pageKey, variant = "desktop") => {
  const safeName = pageKey.replace(/\//g, "_");
  const sub = variant === "mobile" ? "Mobile" : "Desktop";
  return `/uploads/PageHeroes/${safeName}/${sub}/`;
};

/**
 * Compress a single image file with Sharp.
 * @param {Buffer} buffer  - Raw file buffer
 * @param {"desktop"|"mobile"} variant
 */
const compressToWebP = async (buffer, variant = "desktop") => {
  const sharp = require("sharp");
  if (variant === "mobile") {
    return sharp(buffer)
      .resize(768, 1024, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }
  return sharp(buffer)
    .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
};

/**
 * Process one file, write to disk, return { url, stat }
 */
const processAndSave = async (file, folder, basePath, variant = "desktop") => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const baseName = `hero-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const webpFilename = `${baseName}.webp`;
  const destPath = path.join(folder, webpFilename);

  const compressedBuffer = await compressToWebP(file.buffer, variant);
  fs.writeFileSync(destPath, compressedBuffer);

  const originalSize = file.size || file.buffer?.length || 0;
  const compressedSize = compressedBuffer.length;
  const savedPercent = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return {
    url: basePath + webpFilename,
    stat: {
      variant,
      originalName: file.originalname,
      originalSize,
      compressedSize,
      savedPercent,
      savedBytes: originalSize - compressedSize,
    },
  };
};

// ── GET  /api/page-heroes ─────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const docs = await PageHeroImage.find().sort({ pageKey: 1 });
    const map = {};
    docs.forEach((d) => { map[d.pageKey] = d; });
    res.json({ pages: map, pageKeys: PAGE_KEYS });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch page heroes", error: err.message });
  }
});

// ── GET  /api/page-heroes/:pageKey ────────────────────────────────────────────
router.get("/:pageKey/primary-image", async (req, res) => {
  try {
    const pageKey = decode(req.params.pageKey);
    const doc = await PageHeroImage.findOne({ pageKey }).select("images").lean();
    const primaryImage = getPrimaryActiveImage(doc?.images || []);
    const fallbackUrl = toAbsoluteUrl(req, "/heroBg-desktop.webp");
    const imageUrl = primaryImage?.url
      ? toAbsoluteUrl(req, primaryImage.url)
      : fallbackUrl;

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return res.redirect(302, imageUrl);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to resolve primary hero image",
      error: err.message,
    });
  }
});

router.get("/:pageKey", async (req, res) => {
  try {
    const pageKey = decode(req.params.pageKey);
    const doc = await PageHeroImage.findOne({ pageKey });
    if (!doc) return res.json({ pageKey, images: [] });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch page hero images", error: err.message });
  }
});

// ── POST  /api/page-heroes/:pageKey/preview-compression ──────────────────────
// Previews both desktop & mobile compression stats (no disk write)
router.post("/:pageKey/preview-compression", cpUpload, async (req, res) => {
  try {
    const sharp = require("sharp");
    const desktopFiles = (req.files?.["pageHeroImages"]       || []);
    const mobileFiles  = (req.files?.["pageHeroImagesMobile"] || []);
    const imageStats   = [];

    for (const file of desktopFiles) {
      const buf = await compressToWebP(file.buffer, "desktop");
      const originalSize = file.buffer.length;
      const compressedSize = buf.length;
      imageStats.push({
        variant: "desktop",
        originalName: file.originalname,
        originalSize,
        compressedSize,
        savedPercent: Math.round((1 - compressedSize / originalSize) * 100),
        savedBytes: originalSize - compressedSize,
      });
    }
    for (const file of mobileFiles) {
      const buf = await compressToWebP(file.buffer, "mobile");
      const originalSize = file.buffer.length;
      const compressedSize = buf.length;
      imageStats.push({
        variant: "mobile",
        originalName: file.originalname,
        originalSize,
        compressedSize,
        savedPercent: Math.round((1 - compressedSize / originalSize) * 100),
        savedBytes: originalSize - compressedSize,
      });
    }

    res.json({ imageStats });
  } catch (err) {
    res.status(400).json({ message: "Failed to preview compression", error: err.message });
  }
});

// ── POST  /api/page-heroes/:pageKey/images ────────────────────────────────────
// Upload desktop (+ optional mobile) images; paired by array index.
router.post("/:pageKey/images", cpUpload, async (req, res) => {
  try {
    const pageKey = decode(req.params.pageKey);
    if (!PAGE_KEYS.includes(pageKey)) {
      return res.status(400).json({ message: `Unknown page key: "${pageKey}"` });
    }

    const desktopFiles = (req.files?.["pageHeroImages"]       || []);
    const mobileFiles  = (req.files?.["pageHeroImagesMobile"] || []);

    if (desktopFiles.length === 0 && mobileFiles.length === 0) {
      return res.status(400).json({ message: "No images provided." });
    }

    // ── Mobile-only upload: attach to existing entries by position ────────────
    if (desktopFiles.length === 0 && mobileFiles.length > 0) {
      const doc = await PageHeroImage.findOne({ pageKey });
      if (!doc || doc.images.length === 0) {
        return res.status(400).json({
          message: "No desktop images exist for this page yet. Upload desktop images first.",
        });
      }

      // Sort all images by order
      const sortedImages = [...doc.images].sort((a, b) => a.order - b.order);

      // Prefer images without a mobileUrl (fill gaps first), then fall back to all in order
      const withoutMobile = sortedImages.filter((img) => !img.mobileUrl);
      const targets = withoutMobile.length > 0 ? withoutMobile : sortedImages;

      const imageStats = [];

      for (let i = 0; i < Math.min(mobileFiles.length, targets.length); i++) {
        const target = targets[i];

        const { url: mobileUrl, stat } = await processAndSave(
          mobileFiles[i],
          heroFolder(pageKey, "mobile"),
          heroBasePath(pageKey, "mobile"),
          "mobile"
        );
        imageStats.push(stat);

        // Delete old mobile file from disk if present (only happens in fallback mode)
        if (target.mobileUrl) {
          const oldPath = resolveUploadPath(target.mobileUrl);
          fs.unlink(oldPath, (e) => {
            if (e && e.code !== "ENOENT")
              console.error("Failed to delete old mobile hero:", e.message);
          });
        }

        // Use MongoDB arrayFilters — bypasses Mongoose change tracking entirely
        await PageHeroImage.updateOne(
          { pageKey },
          { $set: { "images.$[elem].mobileUrl": mobileUrl } },
          { arrayFilters: [{ "elem._id": target._id }] }
        );
      }

      const updated = await PageHeroImage.findOne({ pageKey });
      return res.status(200).json({ page: updated, imageStats });
    }

    const imageStats = [];
    const newImages  = [];

    for (let i = 0; i < desktopFiles.length; i++) {
      const { url: desktopUrl, stat: dStat } = await processAndSave(
        desktopFiles[i],
        heroFolder(pageKey, "desktop"),
        heroBasePath(pageKey, "desktop"),
        "desktop"
      );
      imageStats.push(dStat);

      let mobileUrl = "";
      if (mobileFiles[i]) {
        const { url: mUrl, stat: mStat } = await processAndSave(
          mobileFiles[i],
          heroFolder(pageKey, "mobile"),
          heroBasePath(pageKey, "mobile"),
          "mobile"
        );
        mobileUrl = mUrl;
        imageStats.push(mStat);
      }

      newImages.push({
        url:       desktopUrl,
        mobileUrl: mobileUrl,
        alt:       req.body.alt || "",
        isActive:  true,
      });
    }

    let doc = await PageHeroImage.findOne({ pageKey });
    if (!doc) doc = new PageHeroImage({ pageKey, images: [] });

    const startOrder = doc.images.length;
    newImages.forEach((img, i) => doc.images.push({ ...img, order: startOrder + i }));
    await doc.save();

    res.status(201).json({ page: doc, imageStats });
  } catch (err) {
    console.error("Error uploading hero images:", err);
    res.status(500).json({ message: "Failed to upload hero images", error: err.message });
  }
});

// ── PUT  /api/page-heroes/:pageKey/images/reorder ────────────────────────────
router.put("/:pageKey/images/reorder", async (req, res) => {
  try {
    const pageKey = decode(req.params.pageKey);
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds must be an array" });
    }

    const doc = await PageHeroImage.findOne({ pageKey });
    if (!doc) return res.status(404).json({ message: "Page not found" });

    const imageMap = {};
    doc.images.forEach((img) => { imageMap[img._id.toString()] = img; });
    const reordered = orderedIds
      .filter((id) => imageMap[id])
      .map((id, index) => { const img = imageMap[id]; img.order = index; return img; });

    doc.images = reordered;
    await doc.save();
    res.json({ page: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to reorder images", error: err.message });
  }
});

// ── PATCH  /api/page-heroes/:pageKey/images/:imageId ─────────────────────────
// Edit a single image. Accepts:
//   - pageHeroImages       → replaces desktop URL
//   - pageHeroImagesMobile → replaces or removes mobile URL
//   - alt, isActive        → metadata
//   - removeMobile=true    → clears mobileUrl (body field)
router.patch("/:pageKey/images/:imageId", cpUpload, async (req, res) => {
  try {
    const pageKey = decode(req.params.pageKey);
    const { imageId } = req.params;
    const doc = await PageHeroImage.findOne({ pageKey });
    if (!doc) return res.status(404).json({ message: "Page not found" });

    const imgEntry = doc.images.id(imageId);
    if (!imgEntry) return res.status(404).json({ message: "Image not found" });

    const imageStats = [];

    // ── Replace desktop image ────────────────────────────────────────────────
    const desktopFile = req.files?.["pageHeroImages"]?.[0];
    if (desktopFile) {
      const { url: newUrl, stat } = await processAndSave(
        desktopFile,
        heroFolder(pageKey, "desktop"),
        heroBasePath(pageKey, "desktop"),
        "desktop"
      );
      imageStats.push(stat);
      // Delete old desktop file
      if (imgEntry.url) {
        const oldPath = resolveUploadPath(imgEntry.url);
        fs.unlink(oldPath, (e) => {
          if (e && e.code !== "ENOENT") console.error("Failed to delete old desktop hero:", e.message);
        });
      }
      imgEntry.url = newUrl;
    }

    // ── Replace mobile image ─────────────────────────────────────────────────
    const mobileFile = req.files?.["pageHeroImagesMobile"]?.[0];
    if (mobileFile) {
      const { url: newMobileUrl, stat } = await processAndSave(
        mobileFile,
        heroFolder(pageKey, "mobile"),
        heroBasePath(pageKey, "mobile"),
        "mobile"
      );
      imageStats.push(stat);
      // Delete old mobile file
      if (imgEntry.mobileUrl) {
        const oldPath = resolveUploadPath(imgEntry.mobileUrl);
        fs.unlink(oldPath, (e) => {
          if (e && e.code !== "ENOENT") console.error("Failed to delete old mobile hero:", e.message);
        });
      }
      imgEntry.mobileUrl = newMobileUrl;
    }

    // ── Remove mobile image ──────────────────────────────────────────────────
    if (req.body.removeMobile === "true" && imgEntry.mobileUrl) {
      const oldPath = resolveUploadPath(imgEntry.mobileUrl);
      fs.unlink(oldPath, (e) => {
        if (e && e.code !== "ENOENT") console.error("Failed to delete mobile hero:", e.message);
      });
      imgEntry.mobileUrl = "";
    }

    // ── Metadata ─────────────────────────────────────────────────────────────
    if (req.body.alt !== undefined) imgEntry.alt = req.body.alt;
    if (req.body.isActive !== undefined) {
      imgEntry.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    await doc.save();
    res.json({ page: doc, imageStats });
  } catch (err) {
    console.error("Error updating hero image:", err);
    res.status(500).json({ message: "Failed to update hero image", error: err.message });
  }
});

// ── DELETE  /api/page-heroes/:pageKey/images/:imageId ────────────────────────
router.delete("/:pageKey/images/:imageId", async (req, res) => {
  try {
    const pageKey = decode(req.params.pageKey);
    const { imageId } = req.params;
    const doc = await PageHeroImage.findOne({ pageKey });
    if (!doc) return res.status(404).json({ message: "Page not found" });

    const imgEntry = doc.images.id(imageId);
    if (!imgEntry) return res.status(404).json({ message: "Image not found" });

    // Delete both desktop and mobile files
    const deleteFile = (url) => {
      if (!url) return;
      const fp = resolveUploadPath(url);
      fs.unlink(fp, (e) => {
        if (e && e.code !== "ENOENT") console.error("Failed to delete hero image file:", e.message);
      });
    };
    deleteFile(imgEntry.url);
    deleteFile(imgEntry.mobileUrl);

    imgEntry.deleteOne();
    doc.images.forEach((img, i) => { img.order = i; });
    await doc.save();

    res.json({ message: "Image deleted successfully", page: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete image", error: err.message });
  }
});

module.exports = router;
