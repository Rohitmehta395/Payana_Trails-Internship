const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const instance = new ILovePDFApi(
  process.env.ILOVEPDF_PUBLIC_KEY,
  process.env.ILOVEPDF_SECRET_KEY
);
const Trail = require("../models/Trail");
const { processImages, resolveUploadPath, getImageStats } = require("../middlewares/processImage");
const { requireAdmin, requireAdminIfRequested } = require("../middlewares/adminAuth");

// Use memoryStorage so Sharp can intercept buffers before writing to disk
const upload = multer({ storage: multer.memoryStorage() });
const cpUpload = upload.fields([
  { name: 'routeMap', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'trailImages', maxCount: 20 },
  { name: 'itineraryPdf', maxCount: 1 },
]);

const MAX_ITINERARY_PDF_BYTES = 1024 * 1024;

// Resolves the upload folder for a trail based on the trail name in the request
const trailFolderResolver = (req) => {
  const sanitizedName = (req.body.trailName || "Unnamed_Trail").replace(/[^a-z0-9]/gi, '_');
  return path.join(__dirname, "..", "uploads", "Trails", sanitizedName);
};

const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};



const optimizePdfBuffer = async (pdfBuffer) => {
  const tempId = Date.now();
  const tempInputPath = path.join(__dirname, "..", "uploads", `temp_input_${tempId}.pdf`);
  
  try {
    // 1. Write buffer to a temporary file
    fs.writeFileSync(tempInputPath, pdfBuffer);

    // 2. Create the ILovePDF compression task
    const task = instance.newTask('compress');

    // 3. Start the task (REQUIRED — registers the task server-side)
    await task.start();

    // 4. Add the local file — must use ILovePDFFile wrapper.
    //    Passing a plain string calls uploadFromUrl() (expects a public URL → 400 error).
    //    ILovePDFFile wraps the path so addFile() uses uploadFromFile() instead.
    const pdfFile = new ILovePDFFile(tempInputPath);
    await task.addFile(pdfFile);
    
    // 5. Process with extreme compression
    await task.process({ compression_level: 'extreme' });
    
    // 6. Download — returns raw PDF bytes for single-file tasks
    const downloadedBuffer = await task.download();
    
    return {
      ok: true,
      buffer: Buffer.from(downloadedBuffer),
    };
  } catch (error) {
    console.error("ILovePDF optimization error:", error.message);
    return {
      ok: false,
      error: "ILovePDF API error. Please try again or upload a smaller PDF.",
    };
  } finally {
    // 7. Cleanup temporary file
    if (fs.existsSync(tempInputPath)) {
      try { fs.unlinkSync(tempInputPath); } catch (e) { console.error("Temp file cleanup error:", e); }
    }
  }
};

const buildStoredPdfName = (originalName = "itinerary.pdf") => {
  const parsed = path.parse(originalName);
  const baseName = (parsed.name || "itinerary")
    .replace(/[^a-z0-9-_]+/gi, "_")
    .replace(/^_+|_+$/g, "");

  return `${baseName || "itinerary"}.pdf`;
};

const buildPdfFileName = () => `itinerary-${Date.now()}.pdf`;

const prepareItineraryPdfUpload = async ({
  req,
  folder,
  basePath,
  existingTrail = null,
}) => {
  const removeExistingPdf = req.body.removeItineraryPdf === "true";
  const autoCompressPdf = Array.isArray(req.body.autoCompressItineraryPdf)
    ? req.body.autoCompressItineraryPdf.includes("true")
    : req.body.autoCompressItineraryPdf === "true";
  const uploadedPdf = req.files?.itineraryPdf?.[0];
  const filesToDelete = [];

  if (!uploadedPdf) {
    if (removeExistingPdf && existingTrail?.itineraryPdf) {
      filesToDelete.push(existingTrail.itineraryPdf);
      return {
        itineraryPdf: "",
        itineraryPdfName: "",
        filesToDelete,
      };
    }

    return { filesToDelete };
  }

  const originalName = uploadedPdf.originalname || "itinerary.pdf";
  const hasPdfMime =
    uploadedPdf.mimetype === "application/pdf" ||
    originalName.toLowerCase().endsWith(".pdf");

  if (!hasPdfMime) {
    throw new Error("Itinerary PDF must be a valid .pdf file.");
  }

  let finalBuffer = uploadedPdf.buffer;

  if (finalBuffer.length > MAX_ITINERARY_PDF_BYTES) {
    if (!autoCompressPdf) {
      throw new Error(
        "Itinerary PDF is larger than 1 MB. Turn on auto-compress or upload a PDF that is already under 1 MB.",
      );
    }

    const compressionResult = await optimizePdfBuffer(finalBuffer);

    if (compressionResult.ok) {
      finalBuffer = compressionResult.buffer;
    } else {
      console.warn("PDF compression failed:", compressionResult.error);
      // We continue with original buffer as per user's request for leniency
    }
  }

  const stats = {
    originalSize: uploadedPdf.buffer.length,
    compressedSize: finalBuffer.length,
    savedPercent: Math.round((1 - finalBuffer.length / uploadedPdf.buffer.length) * 100),
    didCompress: finalBuffer.length < uploadedPdf.buffer.length,
  };

  ensureFolderExists(folder);
  const fileName = buildPdfFileName();
  const destination = path.join(folder, fileName);
  fs.writeFileSync(destination, finalBuffer);

  if (existingTrail?.itineraryPdf) {
    filesToDelete.push(existingTrail.itineraryPdf);
  }

  return {
    itineraryPdf: `${basePath}${fileName}`,
    itineraryPdfName: buildStoredPdfName(originalName),
    filesToDelete,
    stats,
  };
};

const normalizeItinerary = (itinerary) =>
  itinerary
    .map((day) => ({
      title: typeof day?.title === "string" ? day.title.trim() : "",
      points: Array.isArray(day?.points)
        ? day.points
            .map((point) => (typeof point === "string" ? point.trim() : ""))
            .filter(Boolean)
        : [],
      accommodation:
        typeof day?.accommodation === "string" ? day.accommodation.trim() : "",
      meals: typeof day?.meals === "string" ? day.meals.trim() : "",
    }))
    .filter(
      (day) =>
        day.title ||
        day.points.length > 0 ||
        day.accommodation ||
        day.meals,
    );

const normalizeStringArray = (arr, maxLen) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((s) => (typeof s === "string" ? s.slice(0, maxLen) : ""))
    .slice(0, 4);
};

const normalizeFlights = (raw) => {
  if (!raw || typeof raw !== "object") return {};
  return {
    domesticIntro:      typeof raw.domesticIntro === "string"      ? raw.domesticIntro.slice(0, 200)      : "",
    domesticLines:      normalizeStringArray(raw.domesticLines, 200),
    internationalIntro: typeof raw.internationalIntro === "string" ? raw.internationalIntro.slice(0, 200) : "",
    arrivalAirport:     typeof raw.arrivalAirport === "string"     ? raw.arrivalAirport.slice(0, 200)     : "",
    arrivalOptions:     normalizeStringArray(raw.arrivalOptions, 200),
    departureAirport:   typeof raw.departureAirport === "string"   ? raw.departureAirport.slice(0, 200)   : "",
    departureOptions:   normalizeStringArray(raw.departureOptions, 200),
  };
};

const cloneItinerary = (itinerary = []) =>
  Array.isArray(itinerary)
    ? itinerary.map((day) => ({
        title: typeof day?.title === "string" ? day.title : "",
        points: Array.isArray(day?.points)
          ? day.points.map((point) =>
              typeof point === "string" ? point : "",
            )
          : [],
        accommodation:
          typeof day?.accommodation === "string" ? day.accommodation : "",
        meals: typeof day?.meals === "string" ? day.meals : "",
      }))
    : [];

const buildDuplicateTrailName = (trailName = "") => {
  const baseName =
    typeof trailName === "string" && trailName.trim()
      ? trailName.trim()
      : "Untitled Trail";

  return baseName.endsWith(" - Copy") ? baseName : `${baseName} - Copy`;
};


// GET all trails
// Admin panel gets everything; public pages only get active trails
router.get("/", requireAdminIfRequested, async (req, res) => {
  try {
    const isAdmin = req.query.admin === "true";
    const filter = isAdmin ? {} : { isActive: true, status: 'published' };
    const trails = await Trail.find(filter).sort({ order: 1, createdAt: -1 });

    // Self-healing: Ensure every trail in the response has a slug for the frontend
    const trailsWithSlugs = trails.map((trail) => {
      const trailObj = trail.toObject();
      if (!isAdmin) {
        delete trailObj.itineraryDraft;
      }
      if (!trailObj.slug) {
        // Fallback slug generation for items already in DB without slugs
        trailObj.slug = (trailObj.trailName || "unnamed")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        // If still empty, use ID
        if (!trailObj.slug) trailObj.slug = trailObj._id.toString();
      }
      return trailObj;
    });

    res.status(200).json(trailsWithSlugs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch trails", error: error.message });
  }
});

// GET single trail by id or slug
router.get("/:identifier", requireAdminIfRequested, async (req, res) => {
  try {
    const { identifier } = req.params;
    const isAdmin = req.query.admin === "true";
    
    let filter = {};
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    
    if (isObjectId) {
      filter = { _id: identifier };
    } else {
      filter = { slug: identifier };
    }

    if (!isAdmin) {
      filter.isActive = true;
      filter.status = 'published';
    }

    let trail = await Trail.findOne(filter);

    // Fallback: If not found by slug and identifier is not an ID, 
    // try to find by slugifying all trail names (handles legacy records)
    if (!trail && !isObjectId) {
      const allTrails = await Trail.find(isAdmin ? {} : { isActive: true, status: 'published' });
      trail = allTrails.find(t => {
        const s = (t.trailName || "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return s === identifier;
      });
    }

    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    const trailResponse = trail.toObject();
    if (!isAdmin) {
      delete trailResponse.itineraryDraft;
    }

    res.status(200).json(trailResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch trail", error: error.message });
  }
});



// PATCH toggle a trail's active status
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.id);
    if (!trail) return res.status(404).json({ message: "Trail not found" });
    trail.isActive = !trail.isActive;
    await trail.save();
    res.status(200).json({ isActive: trail.isActive, message: `Trail ${trail.isActive ? "activated" : "deactivated"} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle trail status", error: error.message });
  }
});

// PUT (Reorder) trails
router.put("/reorder", requireAdmin, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Trail.bulkWrite(bulkOps);
    res.status(200).json({ message: "Trails reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder trails", error: error.message });
  }
});

// POST image compression preview for admin uploads
router.post("/preview-image-stats", requireAdmin, cpUpload, async (req, res) => {
  try {
    const imageStats = await getImageStats(req.files || {});
    res.status(200).json({ imageStats });
  } catch (error) {
    console.error("Error previewing trail image compression:", error);
    res.status(400).json({
      message: "Failed to preview image compression",
      error: error.message,
    });
  }
});

// POST a new trail
router.post("/", requireAdmin, cpUpload, processImages(trailFolderResolver), async (req, res) => {
  try {
    const sanitizedName = (req.body.trailName || "Unnamed_Trail").replace(/[^a-z0-9]/gi, '_');
    const uploadFolder = path.join(__dirname, "..", "uploads", "Trails", sanitizedName);
    const basePath = `/uploads/Trails/${sanitizedName}/`;
    const pdfUpload = await prepareItineraryPdfUpload({
      req,
      folder: uploadFolder,
      basePath,
    });

    const trailData = {
      ...req.body,
      routeMap: req.files && req.files['routeMap'] ? basePath + req.files['routeMap'][0].filename : "",
      heroImage: req.files && req.files['heroImage'] ? basePath + req.files['heroImage'][0].filename : "",
      trailImages: req.files && req.files['trailImages'] ? req.files['trailImages'].map(f => basePath + f.filename) : [],
      itineraryPdf: pdfUpload.itineraryPdf || "",
      itineraryPdfName: pdfUpload.itineraryPdfName || "",
      itineraryPdfStats: pdfUpload.stats || null,
      highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
      whatsIncluded: req.body.whatsIncluded ? JSON.parse(req.body.whatsIncluded) : [],
      whatsNotIncluded: req.body.whatsNotIncluded ? JSON.parse(req.body.whatsNotIncluded) : [],
    };
    
    // Handle empty journeyDate string from frontend FormData
    if (trailData.journeyDate === "") {
      trailData.journeyDate = null;
    }

    if (trailData.status) {
      trailData.isActive = trailData.status === 'published';
    }

    if (trailData.status !== 'draft' && (!trailData.routeMap || !trailData.heroImage)) {
      return res.status(400).json({ message: "Both Route Map and Hero Image are required for published trails." });
    }

    delete trailData.autoCompressItineraryPdf;
    delete trailData.removeItineraryPdf;

    const newTrail = new Trail(trailData);
    const savedTrail = await newTrail.save();
    res.status(201).json({ 
      trail: savedTrail, 
      imageStats: req.imageStats || [],
      itineraryPdfStats: trailData.itineraryPdfStats || null,
    });
  } catch (error) {
    console.error("Error creating trail:", error);
    let errMsg = error.message || "Failed to create trail";
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      errMsg = "Validation Error: " + messages.join(", ");
    }
    res.status(400).json({ message: errMsg });
  }
});

// POST duplicate an existing trail as a new draft without images
router.post("/:id/duplicate", requireAdmin, async (req, res) => {
  try {
    const sourceTrail = await Trail.findById(req.params.id);
    if (!sourceTrail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    const sourceItinerary =
      Array.isArray(sourceTrail.itineraryDraft) &&
      sourceTrail.itineraryDraft.length > 0
        ? sourceTrail.itineraryDraft
        : sourceTrail.itinerary;

    const highestOrderedTrail = await Trail.findOne()
      .sort({ order: -1, createdAt: -1 })
      .select("order");

    const duplicateTrail = new Trail({
      status: "draft",
      trailTheme: sourceTrail.trailTheme || "",
      trailType: sourceTrail.trailType || "",
      trailName: buildDuplicateTrailName(sourceTrail.trailName),
      trailDestination: sourceTrail.trailDestination || "",
      trailSubTitle: sourceTrail.trailSubTitle || "",
      pricing: sourceTrail.pricing || "",
      duration: sourceTrail.duration || "",
      journeyDate: sourceTrail.journeyDate || null,
      trailRoute: sourceTrail.trailRoute || "",
      visa: sourceTrail.visa || "",
      bestTimeToTravel: sourceTrail.bestTimeToTravel || "",
      comfortLevel: sourceTrail.comfortLevel || "",
      overview: sourceTrail.overview || "",
      highlights: Array.isArray(sourceTrail.highlights)
        ? [...sourceTrail.highlights]
        : [],
      isThisJourneyForYou: sourceTrail.isThisJourneyForYou || "",
      routeMap: "",
      heroImage: "",
      trailImages: [],
      whatsIncluded: Array.isArray(sourceTrail.whatsIncluded)
        ? [...sourceTrail.whatsIncluded]
        : [],
      whatsNotIncluded: Array.isArray(sourceTrail.whatsNotIncluded)
        ? [...sourceTrail.whatsNotIncluded]
        : [],
      itineraryPdf: "",
      itineraryPdfName: "",
      itinerary: cloneItinerary(sourceItinerary),
      itineraryDraft: cloneItinerary(sourceItinerary),
      optionalExperiences: Array.isArray(sourceTrail.optionalExperiences)
        ? [...sourceTrail.optionalExperiences]
        : [],
      flights: normalizeFlights(sourceTrail.flights),
      order:
        typeof highestOrderedTrail?.order === "number"
          ? highestOrderedTrail.order + 1
          : 0,
      isActive: false,
    });

    const savedTrail = await duplicateTrail.save();
    res.status(201).json({
      trail: savedTrail,
      message: "Trail duplicated successfully",
    });
  } catch (error) {
    console.error("Error duplicating trail:", error);
    res
      .status(500)
      .json({ message: "Failed to duplicate trail", error: error.message });
  }
});

// --- NEW: PUT (Update) a trail ---
router.put("/:id", requireAdmin, cpUpload, processImages(trailFolderResolver), async (req, res) => {
  try {
    const trailId = req.params.id;
    const existingTrail = await Trail.findById(trailId);
    if (!existingTrail) return res.status(404).json({ message: "Trail not found" });

    let updateData = { ...req.body };
    const sanitizedName = (updateData.trailName || existingTrail.trailName || "Unnamed_Trail").replace(/[^a-z0-9]/gi, '_');
    const uploadFolder = path.join(__dirname, "..", "uploads", "Trails", sanitizedName);
    const basePath = `/uploads/Trails/${sanitizedName}/`;

    // Parse arrays
    if (updateData.highlights) updateData.highlights = JSON.parse(updateData.highlights);
    if (updateData.whatsIncluded) updateData.whatsIncluded = JSON.parse(updateData.whatsIncluded);
    if (updateData.whatsNotIncluded) updateData.whatsNotIncluded = JSON.parse(updateData.whatsNotIncluded);
    if (updateData.itinerary) updateData.itinerary = JSON.parse(updateData.itinerary);

    // Track old files to delete
    const filesToDelete = [];

    // If new images were uploaded, update the image paths
    if (req.files && req.files['routeMap']) {
      updateData.routeMap = basePath + req.files['routeMap'][0].filename;
      if (existingTrail.routeMap) filesToDelete.push(existingTrail.routeMap);
    }
    if (req.files && req.files['heroImage']) {
      updateData.heroImage = basePath + req.files['heroImage'][0].filename;
      if (existingTrail.heroImage) filesToDelete.push(existingTrail.heroImage);
    }
    
    // Process multiple trail images
    let finalTrailImages = [];
    if (req.body.existingTrailImages) {
      finalTrailImages = JSON.parse(req.body.existingTrailImages);
    }
    if (req.files && req.files['trailImages']) {
      finalTrailImages = finalTrailImages.concat(req.files['trailImages'].map(f => basePath + f.filename));
    }
    updateData.trailImages = finalTrailImages;

    const pdfUpload = await prepareItineraryPdfUpload({
      req,
      folder: uploadFolder,
      basePath,
      existingTrail,
    });
    if (Object.prototype.hasOwnProperty.call(pdfUpload, "itineraryPdf")) {
      updateData.itineraryPdf = pdfUpload.itineraryPdf;
      updateData.itineraryPdfName = pdfUpload.itineraryPdfName || "";
      req.itineraryPdfStats = pdfUpload.stats;
    }
    filesToDelete.push(...(pdfUpload.filesToDelete || []));

    // Remove deleted images from disk
    if (req.body.imagesToDelete) {
      const toDelete = JSON.parse(req.body.imagesToDelete);
      filesToDelete.push(...toDelete);
    }

    await Promise.all(
      filesToDelete.map(async (storedPath) => {
        const filePath = resolveUploadPath(storedPath);
        try {
          await fs.promises.unlink(filePath);
          console.log("Deleted file:", filePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.error("Failed to delete file:", filePath, err.message);
          }
        }
      })
    );

    if (updateData.status) {
      updateData.isActive = updateData.status === 'published';
    }

    // Apply updates to the already-fetched existingTrail (avoid redundant DB call)
    // Exclude 'slug' from updateData so the pre-save hook always controls it
    delete updateData.autoCompressItineraryPdf;
    delete updateData.removeItineraryPdf;
    delete updateData.existingTrailImages;
    delete updateData.imagesToDelete;
    delete updateData.slug;
    Object.keys(updateData).forEach(key => {
      existingTrail[key] = updateData[key];
    });

    const updatedTrail = await existingTrail.save();

    res.status(200).json({ 
      trail: updatedTrail, 
      imageStats: req.imageStats || [],
      itineraryPdfStats: req.itineraryPdfStats || null,
    });
  } catch (error) {
    console.error("Error updating trail:", error);
    let errMsg = error.message || "Failed to update trail";
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      errMsg = "Validation Error: " + messages.join(", ");
    }
    res.status(400).json({ message: errMsg });
  }
});

// PATCH update itinerary for a trail (JSON body, no file upload needed)
router.patch("/:id/itinerary", requireAdmin, async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.id);
    if (!trail) return res.status(404).json({ message: "Trail not found" });

    const { itinerary, mode = "save", optionalExperiences, flights } = req.body;
    if (!Array.isArray(itinerary)) {
      return res.status(400).json({ message: "itinerary must be an array" });
    }

    const normalizedItinerary      = normalizeItinerary(itinerary);
    const normalizedExperiences    = Array.isArray(optionalExperiences)
      ? optionalExperiences.map((s) => (typeof s === "string" ? s.slice(0, 300) : "")).slice(0, 4)
      : trail.optionalExperiences;
    const normalizedFlights        = flights !== undefined
      ? normalizeFlights(flights)
      : trail.flights;

    if (mode === "draft") {
      trail.itineraryDraft      = normalizedItinerary;
      trail.optionalExperiences = normalizedExperiences;
      trail.flights             = normalizedFlights;
    } else {
      trail.itinerary           = normalizedItinerary;
      trail.itineraryDraft      = normalizedItinerary;
      trail.optionalExperiences = normalizedExperiences;
      trail.flights             = normalizedFlights;
    }

    await trail.save();
    res.status(200).json({
      trail,
      message:
        mode === "draft"
          ? "Itinerary draft saved successfully"
          : "Itinerary saved successfully",
    });
  } catch (error) {
    console.error("Error saving itinerary:", error);
    res.status(500).json({ message: "Failed to save itinerary", error: error.message });
  }
});

// --- NEW: DELETE a trail ---
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const trailId = req.params.id;
    const trailToDelete = await Trail.findById(trailId);

    if (!trailToDelete)
      return res.status(404).json({ message: "Trail not found" });

    // Extract all unique folders where this trail's images reside
    const allImages = [
      trailToDelete.routeMap,
      trailToDelete.heroImage,
      trailToDelete.itineraryPdf,
      ...(trailToDelete.trailImages || [])
    ].filter(Boolean); // removes empty/null ones

    const foldersToDelete = new Set();
    allImages.forEach(imgPath => {
      try {
        const absolutePath = resolveUploadPath(imgPath);
        foldersToDelete.add(path.dirname(absolutePath));
      } catch (e) {}
    });

    // Delete the identified folders
    foldersToDelete.forEach(folderPath => {
      if (fs.existsSync(folderPath)) {
        try {
          fs.rmSync(folderPath, { recursive: true, force: true });
        } catch (e) {
          console.error(`Failed to delete folder: ${folderPath}`, e);
        }
      }
    });

    await Trail.findByIdAndDelete(trailId);
    res.status(200).json({ message: "Trail deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete trail", error: error.message });
  }
});

module.exports = router;
