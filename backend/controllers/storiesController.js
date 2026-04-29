const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const StoriesPage = require("../models/StoriesPage");
const Blog = require("../models/Blog");

const STORY_CATEGORIES = [
  "Heritage Trails",
  "Wildlife Encounters",
  "Cultural Windows",
  "Journey Insights",
  "Photo Essays",
  "Travel Anecdotes",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const storiesUploadsFolder = path.join(__dirname, "..", "uploads", "stories");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const deleteFile = (filePath) => {
  if (!filePath) return;
  const fileName = filePath.split("/").pop();
  const folder = filePath.includes("/blogs/") ? null : storiesUploadsFolder;
  if (!folder) return;
  const fp = path.join(folder, fileName);
  fs.unlink(fp, (err) => {
    if (err && err.code !== "ENOENT")
      console.error("Failed to delete file:", err.message);
  });
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

const parseSelectedBlogs = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const getSelectedBlogsObject = (selectedBlogs) => {
  if (!selectedBlogs) return {};
  if (selectedBlogs instanceof Map) return Object.fromEntries(selectedBlogs);
  return selectedBlogs;
};

const serializeStoriesPage = async (page) => {
  const pageObject = page.toObject();
  const selectedBlogs = getSelectedBlogsObject(pageObject.travelStories?.selectedBlogs);
  const categoryBlogs = {};

  await Promise.all(
    STORY_CATEGORIES.map(async (category) => {
      const selectedId = selectedBlogs?.[category];
      let blog = null;

      if (selectedId) {
        blog = await Blog.findOne({
          _id: selectedId,
          category,
          isDraft: false,
        }).select("-draftData");
      }

      if (!blog) {
        blog = await Blog.findOne({ category, isDraft: false })
          .sort({ order: 1, publishDate: -1 })
          .select("-draftData");
      }

      if (blog) {
        categoryBlogs[category] = blog;
      }
    })
  );

  pageObject.travelStories = {
    ...pageObject.travelStories,
    selectedBlogs,
    categoryBlogs,
  };

  return pageObject;
};

// ─── Stories Page Section ────────────────────────────────────────────────────

exports.getStoriesPage = async (req, res) => {
  try {
    let page = await StoriesPage.findOne();
    if (!page) {
      page = await StoriesPage.create({
        travelStories: {
          mainTitle: "Travel Stories",
          subtitle:
            "Reflections, insights, and moments from journeys across the world",
          image: "",
          image1: "",
          image2: "",
          selectedBlogs: {},
        },
      });
    }
    res.status(200).json(await serializeStoriesPage(page));
  } catch (error) {
    console.error("Error fetching Stories page:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTravelStoriesSection = async (req, res) => {
  try {
    let page = await StoriesPage.findOne();
    if (!page) {
      page = new StoriesPage({});
    }

    const { mainTitle, subtitle, selectedBlogs } = req.body;
    const files = req.files || {};
    const imageStats = [];

    ensureDir(storiesUploadsFolder);

    if (mainTitle !== undefined) page.travelStories.mainTitle = mainTitle;
    if (subtitle !== undefined) page.travelStories.subtitle = subtitle;

    if (selectedBlogs !== undefined) {
      const selected = parseSelectedBlogs(selectedBlogs);
      const sanitizedSelections = {};
      STORY_CATEGORIES.forEach((category) => {
        if (selected[category]) sanitizedSelections[category] = selected[category];
      });
      page.travelStories.selectedBlogs = sanitizedSelections;
    }

    const landscapeFile = files.image?.[0];
    if (landscapeFile) {
      const previousImages = [
        page.travelStories.image,
        page.travelStories.image1,
        page.travelStories.image2,
      ].filter(Boolean);

      [...new Set(previousImages)].forEach(deleteFile);

      const file = landscapeFile;
      const baseName = `ts-landscape-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const webpFilename = `${baseName}.webp`;
      const destPath = path.join(storiesUploadsFolder, webpFilename);
      const compressedBuffer = await compressImage(file.buffer, {
        width: 1600,
        quality: 82,
      });
      fs.writeFileSync(destPath, compressedBuffer);
      const originalSize = file.size || file.buffer?.length || 0;
      const compressedSize = compressedBuffer.length;
      imageStats.push({
        field: "Landscape Image",
        originalName: file.originalname,
        originalSize,
        compressedSize,
        savedPercent:
          originalSize > 0
            ? Math.round((1 - compressedSize / originalSize) * 100)
            : 0,
      });
      const imagePath = `/uploads/stories/${webpFilename}`;
      page.travelStories.image = imagePath;
      page.travelStories.image1 = imagePath;
      page.travelStories.image2 = "";
    }

    await page.save();
    res
      .status(200)
      .json({
        message: "Travel Stories section updated",
        page: await serializeStoriesPage(page),
        imageStats,
      });
  } catch (error) {
    console.error("Error updating Travel Stories section:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Blog CRUD ───────────────────────────────────────────────────────────────

/**
 * GET /api/stories/blogs
 * Public. Supports ?category=&destination=&featured=true&page=&limit=
 */
exports.getBlogs = async (req, res) => {
  try {
    const {
      category,
      destination,
      featured,
      page = 1,
      limit = 6,
      all,
    } = req.query;

    const filter = { isDraft: false };
    if (category) filter.category = category;
    if (destination) {
      filter.$or = [
        { destination: { $regex: destination, $options: "i" } },
        { location: { $regex: destination, $options: "i" } },
      ];
    }
    if (featured === "true") filter.featured = true;

    if (all === "true") {
      const blogs = await Blog.find(filter)
        .sort({ order: 1, publishDate: -1 })
        .select("-draftData");
      return res.status(200).json({ blogs, total: blogs.length });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ order: 1, publishDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-draftData"),
      Blog.countDocuments(filter),
    ]);

    res.status(200).json({ blogs, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /api/stories/blogs/admin
 * Admin only. Returns all blogs including drafts.
 */
exports.getBlogsAdmin = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const blogs = await Blog.find(filter)
      .sort({ order: 1, publishDate: -1 })
      .select("-draftData");
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching admin blogs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /api/stories/blogs/:slug
 * Public. Returns a single blog by slug.
 */
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isDraft: false }).select(
      "-draftData"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * POST /api/stories/blogs
 * Admin. Create a new blog.
 */
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      featured,
      publishDate,
      category,
      destination,
      location,
      isDraft,
    } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    let slug = slugify(title);
    // Ensure unique slug
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const blogFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "stories",
      slug
    );
    ensureDir(blogFolder);

    let featuredImagePath = "";
    const imageStats = [];

    if (req.file) {
      const file = req.file;
      const baseName = `featured-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const webpFilename = `${baseName}.webp`;
      const destPath = path.join(blogFolder, webpFilename);
      const compressedBuffer = await compressImage(file.buffer, {
        width: 1920,
        quality: 82,
      });
      fs.writeFileSync(destPath, compressedBuffer);
      const originalSize = file.size || file.buffer?.length || 0;
      const compressedSize = compressedBuffer.length;
      imageStats.push({
        field: "Featured Image",
        originalName: file.originalname,
        originalSize,
        compressedSize,
        savedPercent:
          originalSize > 0
            ? Math.round((1 - compressedSize / originalSize) * 100)
            : 0,
      });
      featuredImagePath = `/uploads/stories/${slug}/${webpFilename}`;
    }

    const highestOrder = await Blog.findOne().sort({ order: -1 }).select("order");
    const newOrder = highestOrder ? highestOrder.order + 1 : 0;

    const blog = await Blog.create({
      title,
      slug,
      excerpt: excerpt || "",
      content: content || "",
      author: author || "",
      featured: featured === "true" || featured === true,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      category: category || "Journey Insights",
      destination: destination || "",
      location: location || "",
      featuredImage: featuredImagePath,
      isDraft: isDraft === "true" || isDraft === true,
      order: newOrder,
    });

    res.status(201).json({ blog, imageStats });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * PUT /api/stories/blogs/:id
 * Admin. Update a blog.
 */
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const {
      title,
      excerpt,
      content,
      author,
      featured,
      publishDate,
      category,
      destination,
      location,
      isDraft,
    } = req.body;

    const oldSlug = blog.slug;
    let newSlug = blog.slug;

    if (title && title !== blog.title) {
      let candidate = slugify(title);
      const existing = await Blog.findOne({ slug: candidate, _id: { $ne: blog._id } });
      if (existing) candidate = `${candidate}-${Date.now()}`;
      newSlug = candidate;
    }

    const imageStats = [];

    // If slug changes, rename the folder
    if (newSlug !== oldSlug) {
      const oldFolder = path.join(__dirname, "..", "uploads", "stories", oldSlug);
      const newFolder = path.join(__dirname, "..", "uploads", "stories", newSlug);
      if (fs.existsSync(oldFolder)) {
        fs.renameSync(oldFolder, newFolder);
        // Update featuredImage path
        if (blog.featuredImage) {
          blog.featuredImage = blog.featuredImage.replace(
            `/uploads/stories/${oldSlug}/`,
            `/uploads/stories/${newSlug}/`
          );
        }
        // Update inline images in content
        if (blog.content) {
          blog.content = blog.content.replace(
            new RegExp(`/uploads/stories/${oldSlug}/`, "g"),
            `/uploads/stories/${newSlug}/`
          );
        }
      }
      blog.slug = newSlug;
    }

    if (title) blog.title = title;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (author !== undefined) blog.author = author;
    if (featured !== undefined) blog.featured = featured === "true" || featured === true;
    if (publishDate) blog.publishDate = new Date(publishDate);
    if (category) blog.category = category;
    if (destination !== undefined) blog.destination = destination;
    if (location !== undefined) blog.location = location;
    if (isDraft !== undefined) blog.isDraft = isDraft === "true" || isDraft === true;

    // Handle new featured image upload
    if (req.file) {
      const blogFolder = path.join(
        __dirname,
        "..",
        "uploads",
        "stories",
        blog.slug
      );
      ensureDir(blogFolder);

      // Delete old featured image
      if (blog.featuredImage) {
        const oldFn = blog.featuredImage.split("/").pop();
        const oldFp = path.join(blogFolder, oldFn);
        fs.unlink(oldFp, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Failed to delete old featured image:", err.message);
        });
      }

      const file = req.file;
      const baseName = `featured-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const webpFilename = `${baseName}.webp`;
      const destPath = path.join(blogFolder, webpFilename);
      const compressedBuffer = await compressImage(file.buffer, {
        width: 1920,
        quality: 82,
      });
      fs.writeFileSync(destPath, compressedBuffer);
      const originalSize = file.size || file.buffer?.length || 0;
      const compressedSize = compressedBuffer.length;
      imageStats.push({
        field: "Featured Image",
        originalName: file.originalname,
        originalSize,
        compressedSize,
        savedPercent:
          originalSize > 0
            ? Math.round((1 - compressedSize / originalSize) * 100)
            : 0,
      });
      blog.featuredImage = `/uploads/stories/${blog.slug}/${webpFilename}`;
    }

    await blog.save();

    // Cleanup unused images from the blog's folder
    const cleanupUnusedBlogImages = (blogSlug, content, featuredImage) => {
      const blogFolder = path.join(__dirname, "..", "uploads", "stories", blogSlug);
      if (!fs.existsSync(blogFolder)) return;

      const contentImages = [];
      const imageRegex = /!\[.*?\]\((.*?)\)/g;
      let match;
      while ((match = imageRegex.exec(content)) !== null) {
        const url = match[1];
        if (url.includes(`/uploads/stories/${blogSlug}/`)) {
          contentImages.push(url.split("/").pop());
        }
      }

      const featuredImageName = featuredImage ? featuredImage.split("/").pop() : null;

      fs.readdir(blogFolder, (err, files) => {
        if (err) return;
        files.forEach((file) => {
          // Skip if it's an image used in content or the featured image
          if (contentImages.includes(file) || file === featuredImageName) return;
          
          const fp = path.join(blogFolder, file);
          // Safety check: only delete files, not directories
          if (fs.lstatSync(fp).isFile()) {
            fs.unlink(fp, (err) => {
              if (err && err.code !== "ENOENT") console.error("Failed to cleanup unused file:", file);
            });
          }
        });
      });
    };

    cleanupUnusedBlogImages(blog.slug, blog.content, blog.featuredImage);

    res.status(200).json({ blog, imageStats });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * DELETE /api/stories/blogs/:id
 * Admin. Deletes the blog and all its images.
 */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete entire uploads/stories/[slug] folder
    const blogFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "stories",
      blog.slug
    );
    deleteDir(blogFolder);

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog and its images deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * PUT /api/stories/blogs/reorder
 * Admin. Update order of blogs.
 */
exports.reorderBlogs = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "items array is required" });
    }
    const bulkOps = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));
    await Blog.bulkWrite(bulkOps);
    res.status(200).json({ message: "Blogs reordered successfully" });
  } catch (error) {
    console.error("Error reordering blogs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * PATCH /api/stories/blogs/:id/autosave
 * Admin. Save draft data for autosave.
 */
exports.autosaveBlog = async (req, res) => {
  try {
    const { draftData } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { draftData, isDraft: true },
      { new: true, upsert: false }
    ).select("-content");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * POST /api/stories/blogs/:slug/images
 * Admin. Upload an inline editor image for the blog.
 */
exports.uploadBlogEditorImage = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const blogFolder = path.join(__dirname, "..", "uploads", "stories", slug);
    ensureDir(blogFolder);

    const baseName = `editor-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const webpFilename = `${baseName}.webp`;
    const destPath = path.join(blogFolder, webpFilename);

    const compressedBuffer = await compressImage(req.file.buffer, {
      width: 900,
      quality: 78,
    });
    fs.writeFileSync(destPath, compressedBuffer);

    const originalSize = req.file.size || req.file.buffer?.length || 0;
    const compressedSize = compressedBuffer.length;

    res.status(200).json({
      url: `/uploads/stories/${slug}/${webpFilename}`,
      imageStats: {
        originalSize,
        compressedSize,
        savedPercent:
          originalSize > 0
            ? Math.round((1 - compressedSize / originalSize) * 100)
            : 0,
      },
    });
  } catch (error) {
    console.error("Error uploading editor image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
