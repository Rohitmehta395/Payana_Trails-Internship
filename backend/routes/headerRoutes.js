const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const headerController = require("../controllers/headerController");
const { requireAdmin } = require("../middlewares/adminAuth");
const { processImages } = require("../middlewares/processImage");

// Memory storage so Sharp can process the buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

// Resolve upload folder for header logo
const folderResolver = () =>
  path.join(__dirname, "..", "uploads", "header");

// Route: GET /api/header — public
router.get("/", headerController.getHeader);

// Multer fields for logo upload
const uploadFields = upload.fields([
  { name: "headerLogo", maxCount: 1 },
]);

const handleUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(413)
          .json({ message: "File too large. Max upload size is 20 MB." });
      }
      return res
        .status(400)
        .json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res
        .status(500)
        .json({ message: `Server error during upload: ${err.message}` });
    }
    next();
  });
};

// Route: PUT /api/header — admin only
router.put(
  "/",
  requireAdmin,
  handleUpload,
  processImages(folderResolver),
  headerController.updateHeader
);

// Route: DELETE /api/header/logo — admin only
router.delete("/logo", requireAdmin, headerController.deleteLogo);

module.exports = router;
