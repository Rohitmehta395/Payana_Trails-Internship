require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── OG / Social-share bot detection ─────────────────────────────────────────
// Must be registered BEFORE API routes and static-file serving so that social
// media crawlers (WhatsApp, Telegram, Twitter, etc.) receive a lightweight HTML
// page with the correct Open Graph <meta> tags instead of the blank React shell.
const ogMiddleware = require("./middlewares/ogMiddleware");
app.use(ogMiddleware);
// ────────────────────────────────────────────────────────────────────────────

// Routes Import
const trailRoutes = require("./routes/trailRoutes");
const adminRoutes = require("./routes/adminRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const pageHeroRoutes = require("./routes/pageHeroRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/trails", trailRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/page-heroes", pageHeroRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/enquiries", enquiryRoutes);

// ── Serve React frontend (production) ────────────────────────────────────────
// In production the React app is built into ../frontend/dist. Express serves it
// so that the OG middleware (above) can intercept bot requests for every URL
// including the homepage and all trail pages — all from a single domain.
const FRONTEND_DIST = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(FRONTEND_DIST)) {
  // Serve static assets (JS, CSS, images)
  app.use(express.static(FRONTEND_DIST));

  // Also serve the hero image referenced in OG tags from the public folder.
  // (It is baked into dist/heroBg-desktop.webp after `npm run build`.)

  // SPA catch-all: every non-API, non-file route returns index.html
  app.get(/^(?!\/api|\/uploads).*$/, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
} else {
  // Development / standalone API mode — basic health-check route only
  app.get("/", (req, res) => {
    res.send("Payana Trails API is running...");
  });
}
// ────────────────────────────────────────────────────────────────────────────

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
