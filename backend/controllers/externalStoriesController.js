const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const ExternalStory = require("../models/ExternalStory");

// ─── Helpers ────────────────────────────────────────────────────────────────

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const deleteDir = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const compressImage = async (buffer, { width = 1200, quality = 80 } = {}) => {
  return sharp(buffer)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
};

const fetchOgImageBuffer = async (url) => {
  try {
    const htmlResponse = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!htmlResponse.ok) return null;
    const html = await htmlResponse.text();

    // Find og:image content
    const ogMatch =
      html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i,
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i,
      );
    if (!ogMatch || !ogMatch[1]) return null;

    let imageUrl = ogMatch[1].replace(/&amp;/g, "&");
    try {
      imageUrl = new URL(imageUrl, url).href;
    } catch (e) {
      console.error("Invalid OG image URL:", imageUrl);
      return null;
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) return null;

    const contentType = imageResponse.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      console.error("URL does not point to an image:", imageUrl, "Content-Type:", contentType);
      return null;
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.error("Error fetching OG image:", err);
    return null;
  }
};

// ─── CRUD ───────────────────────────────────────────────────────────────

exports.getExternalStories = async (req, res) => {
  try {
    const { category, destination, page = 1, limit = 6, all } = req.query;

    const filter = { isDraft: false };
    if (category && category !== "All") filter.category = category;
    if (destination) {
      filter.$or = [
        { destination: { $regex: destination, $options: "i" } },
        { location: { $regex: destination, $options: "i" } },
      ];
    }

    if (all === "true") {
      const stories = await ExternalStory.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .select("-draftData");
      return res.status(200).json({ stories, total: stories.length });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [stories, total] = await Promise.all([
      ExternalStory.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-draftData"),
      ExternalStory.countDocuments(filter),
    ]);

    res
      .status(200)
      .json({ stories, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error("Error fetching external stories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getExternalStoriesAdmin = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;

    const stories = await ExternalStory.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select("-draftData");
    res.status(200).json({ stories });
  } catch (error) {
    console.error("Error fetching admin external stories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createExternalStory = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      author,
      category,
      destination,
      location,
      externalUrl,
      isDraft,
    } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!externalUrl)
      return res.status(400).json({ message: "External URL is required" });

    let slug = slugify(title);
    const existing = await ExternalStory.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const storyFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "stories",
      "externalBlogs",
      slug,
    );
    ensureDir(storyFolder);

    let featuredImagePath = "";
    const imageStats = [];

    let imageBuffer = req.file?.buffer;
    let originalName = req.file?.originalname || "og-image.jpg";
    let originalSize = req.file?.size || 0;

    if (!imageBuffer && !req.file) {
      imageBuffer = await fetchOgImageBuffer(externalUrl);
      if (!imageBuffer) {
        return res
          .status(400)
          .json({
            message:
              "Failed to fetch image from External URL. Please upload an image manually.",
          });
      }
      originalSize = imageBuffer.length;
    }

    if (imageBuffer) {
      const baseName = `featured-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const webpFilename = `${baseName}.webp`;
      const destPath = path.join(storyFolder, webpFilename);
      
      let compressedBuffer;
      try {
        compressedBuffer = await compressImage(imageBuffer, {
          width: 1920,
          quality: 82,
        });
      } catch (sharpError) {
        console.error("Sharp compression failed:", sharpError);
        return res.status(400).json({
          message: "Unsupported or corrupted image format. Please upload a valid JPG, PNG, or WebP image.",
          error: sharpError.message
        });
      }

      fs.writeFileSync(destPath, compressedBuffer);
      const compressedSize = compressedBuffer.length;
      imageStats.push({
        field: "Featured Image",
        originalName,
        originalSize,
        compressedSize,
        savedPercent:
          originalSize > 0
            ? Math.round((1 - compressedSize / originalSize) * 100)
            : 0,
      });
      featuredImagePath = `/uploads/stories/externalBlogs/${slug}/${webpFilename}`;
    }

    const lowestOrderStory = await ExternalStory.findOne()
      .sort({ order: 1 })
      .select("order");
    const newOrder = (lowestOrderStory && typeof lowestOrderStory.order === "number") ? lowestOrderStory.order - 1 : 0;

    const story = await ExternalStory.create({
      title,
      slug,
      excerpt: excerpt || "",
      author: author || "",
      category: category || "Journey Insights",
      destination: destination || "",
      location: location || "",
      externalUrl,
      featuredImage: featuredImagePath,
      isDraft: isDraft === "true" || isDraft === true,
      order: newOrder,
    });

    res.status(201).json({ blog: story, imageStats });
  } catch (error) {
    console.error("Error creating external story:", error);
    // Return detailed error for debugging
    res.status(500).json({ 
      message: error.name === "ValidationError" ? "Validation Error" : "Server error", 
      error: error.message,
      details: error.errors // for Mongoose validation errors
    });
  }
};

exports.updateExternalStory = async (req, res) => {
  try {
    const story = await ExternalStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const {
      title,
      excerpt,
      author,
      category,
      destination,
      location,
      externalUrl,
      isDraft,
    } = req.body;

    const oldSlug = story.slug;
    let newSlug = story.slug;

    if (title && title !== story.title) {
      let candidate = slugify(title);
      const existing = await ExternalStory.findOne({
        slug: candidate,
        _id: { $ne: story._id },
      });
      if (existing) candidate = `${candidate}-${Date.now()}`;
      newSlug = candidate;
    }

    const imageStats = [];

    if (newSlug !== oldSlug) {
      const oldFolder = path.join(
        __dirname,
        "..",
        "uploads",
        "stories",
        "externalBlogs",
        oldSlug,
      );
      const newFolder = path.join(
        __dirname,
        "..",
        "uploads",
        "stories",
        "externalBlogs",
        newSlug,
      );
      if (fs.existsSync(oldFolder)) {
        fs.renameSync(oldFolder, newFolder);
        if (story.featuredImage) {
          story.featuredImage = story.featuredImage.replace(
            `/uploads/stories/externalBlogs/${oldSlug}/`,
            `/uploads/stories/externalBlogs/${newSlug}/`,
          );
        }
      }
      story.slug = newSlug;
    }

    if (title) story.title = title;
    if (excerpt !== undefined) story.excerpt = excerpt;
    if (author !== undefined) story.author = author;
    if (category) story.category = category;
    if (destination !== undefined) story.destination = destination;
    if (location !== undefined) story.location = location;
    if (externalUrl) story.externalUrl = externalUrl;
    if (isDraft !== undefined)
      story.isDraft = isDraft === "true" || isDraft === true;

    // Handle new featured image upload or refetch if URL changed and no image present
    let imageBuffer = req.file?.buffer;
    let originalName = req.file?.originalname || "og-image.jpg";
    let originalSize = req.file?.size || 0;

    // Optional: if externalUrl changed, should we refetch image?
    // Let's only fetch if a file was explicitly not provided AND they want to replace it.
    // However, if they don't provide a file, we keep the existing image unless they clear it.
    // Let's assume if req.file is present, they upload. If not, we don't automatically refetch unless there's no existing image.
    if (!imageBuffer && !req.file && !story.featuredImage && externalUrl) {
      imageBuffer = await fetchOgImageBuffer(externalUrl);
      if (!imageBuffer) {
        return res
          .status(400)
          .json({
            message:
              "Failed to fetch image from External URL. Please upload an image manually.",
          });
      }
      originalSize = imageBuffer.length;
    }

    if (imageBuffer) {
      const storyFolder = path.join(
        __dirname,
        "..",
        "uploads",
        "stories",
        "externalBlogs",
        story.slug,
      );
      ensureDir(storyFolder);

      if (story.featuredImage) {
        const oldFn = story.featuredImage.split("/").pop();
        const oldFp = path.join(storyFolder, oldFn);
        fs.unlink(oldFp, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Failed to delete old featured image:", err.message);
        });
      }

      const baseName = `featured-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const webpFilename = `${baseName}.webp`;
      const destPath = path.join(storyFolder, webpFilename);
      
      let compressedBuffer;
      try {
        compressedBuffer = await compressImage(imageBuffer, {
          width: 1920,
          quality: 82,
        });
      } catch (sharpError) {
        console.error("Sharp compression failed during update:", sharpError);
        return res.status(400).json({
          message: "Unsupported or corrupted image format. Please upload a valid JPG, PNG, or WebP image.",
          error: sharpError.message
        });
      }

      fs.writeFileSync(destPath, compressedBuffer);
      const compressedSize = compressedBuffer.length;
      imageStats.push({
        field: "Featured Image",
        originalName,
        originalSize,
        compressedSize,
        savedPercent:
          originalSize > 0
            ? Math.round((1 - compressedSize / originalSize) * 100)
            : 0,
      });
      story.featuredImage = `/uploads/stories/externalBlogs/${story.slug}/${webpFilename}`;
    }

    await story.save();
    res.status(200).json({ blog: story, imageStats });
  } catch (error) {
    console.error("Error updating external story:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteExternalStory = async (req, res) => {
  try {
    const story = await ExternalStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const storyFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "stories",
      "externalBlogs",
      story.slug,
    );
    deleteDir(storyFolder);

    await ExternalStory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.reorderExternalStories = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "items array is required" });
    }
    const bulkOps = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));
    await ExternalStory.bulkWrite(bulkOps);
    res.status(200).json({ message: "Stories reordered successfully" });
  } catch (error) {
    console.error("Error reordering stories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.autosaveExternalStory = async (req, res) => {
  try {
    const { draftData } = req.body;
    const story = await ExternalStory.findByIdAndUpdate(
      req.params.id,
      { draftData, isDraft: true },
      { new: true, upsert: false },
    );
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.status(200).json({ blog: story });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
