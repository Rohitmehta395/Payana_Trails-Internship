require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");
const app = express();
app.set("trust proxy", true);
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
const referralRoutes = require("./routes/referralRoutes");
const giftRoutes = require("./routes/giftRoutes");
const faqRoutes = require("./routes/faqRoutes");
const homePageRoutes = require("./routes/homePageRoutes");
const payanaWayRoutes = require("./routes/payanaWayRoutes");
const storiesRoutes = require("./routes/storiesRoutes");
const externalStoriesRoutes = require("./routes/externalStoriesRoutes");
const connectPageRoutes = require("./routes/connectPageRoutes");
const journeyPageRoutes = require("./routes/journeyPageRoutes");
const headerRoutes = require("./routes/headerRoutes");
const footerRoutes = require("./routes/footerRoutes");
const legalSectionRoutes = require("./routes/legalSectionRoutes");

const cacheMiddleware = require("./middlewares/cacheMiddleware");

// Routes
app.use("/api/admin", adminRoutes); // No cache for admin
app.use("/api/trails", cacheMiddleware(60), trailRoutes);
app.use("/api/destinations", cacheMiddleware(60), destinationRoutes);
app.use("/api/page-heroes", cacheMiddleware(60), pageHeroRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/faqs", cacheMiddleware(60), faqRoutes);
app.use("/api/home-page", cacheMiddleware(60), homePageRoutes);
app.use("/api/payana-way", cacheMiddleware(60), payanaWayRoutes);
app.use("/api/stories", cacheMiddleware(60), storiesRoutes);
app.use("/api/external-stories", cacheMiddleware(60), externalStoriesRoutes);
app.use("/api/connect-page", cacheMiddleware(60), connectPageRoutes);
app.use("/api/journey-page", cacheMiddleware(60), journeyPageRoutes);
app.use("/api/header", cacheMiddleware(60), headerRoutes);
app.use("/api/footer", cacheMiddleware(60), footerRoutes);
app.use("/api/legal-sections", cacheMiddleware(60), legalSectionRoutes);

// ── Per-page meta for server-side injection ───────────────────────────────────
// Googlebot receives index.html (not the OG middleware HTML) and reads these
// meta tags directly from the server response before executing any JavaScript.
// This ensures every page has the correct title, description, og:title, etc.
// even if Googlebot does not fully render the React app.
const PAGE_META = {
  "/": {
    pageKey: "home",
    title: "Payana Trails | Journeys, thoughtfully curated!",
    description: "Small groups. Deeper experiences. Discover our curated trails around the world.",
  },
  "/home": {
    pageKey: "home",
    title: "Payana Trails | Journeys, thoughtfully curated!",
    description: "Small groups. Deeper experiences. Discover our curated trails around the world.",
  },
  "/journeys": {
    pageKey: "journeys",
    title: "Journeys | Payana Trails",
    description: "Explore signature, wildlife, heritage, cultural, and destination-led journeys thoughtfully designed by Payana Trails.",
  },
  "/journey": {
    pageKey: "journeys",
    title: "Journeys | Payana Trails",
    description: "Explore signature, wildlife, heritage, cultural, and destination-led journeys thoughtfully designed by Payana Trails.",
  },
  "/journeys/signature": {
    pageKey: "journeys/signature",
    title: "Signature Trails | Payana Trails",
    description: "A handpicked collection of Payana Trails journeys with unforgettable landscapes, stories, and experiences.",
  },
  "/journeys/wildlife": {
    pageKey: "journeys/wildlife",
    title: "Wildlife Trails | Payana Trails",
    description: "Explore wildlife journeys where every sighting unfolds at nature's pace, with comfort and depth.",
  },
  "/journeys/heritage": {
    pageKey: "journeys/heritage",
    title: "Heritage Trails | Payana Trails",
    description: "Discover stories, architecture, and living legacies that have shaped civilisations across time.",
  },
  "/journeys/cultural": {
    pageKey: "journeys/cultural",
    title: "Cultural & Immersive Trails | Payana Trails",
    description: "Meaningful encounters that connect you with the people, traditions, and spirit of each destination.",
  },
  "/journeys/destinations": {
    pageKey: "journeys/destinations",
    title: "Destinations | Payana Trails",
    description: "Explore handpicked destinations that open the door to extraordinary journeys and deeper travel experiences.",
  },
  "/payana-way": {
    pageKey: "payana-way",
    title: "The Payana Way | Payana Trails",
    description: "Discover the philosophy behind Payana Trails — journeys built on depth, purpose, and meaningful human connections.",
  },
  "/stories": {
    pageKey: "stories",
    title: "Stories | Payana Trails",
    description: "Reflections, insights, and moments from journeys across the world. Discover the spirit of travel through our stories.",
  },
  "/stories/blogs": {
    pageKey: "stories",
    title: "Travel Stories | Payana Trails",
    description: "Reflections, insights, and moments from journeys across the world. Discover the spirit of travel through our stories.",
  },
  "/stories/external": {
    pageKey: "stories",
    title: "Stories from Our Guests | Payana Trails",
    description: "Guest stories and reflections from travellers who have experienced journeys with Payana Trails.",
  },
  "/stories/testimonials": {
    pageKey: "stories",
    title: "Voices from the Trail | Payana Trails",
    description: "Read testimonials and voices from travellers who have journeyed with Payana Trails.",
  },
  "/connect": {
    pageKey: "connect",
    title: "Connect | Payana Trails",
    description: "Reach out to us. Enquire about a journey, send a referral, or simply say hello — we'd love to hear from you.",
  },
  "/connect/enquiry": {
    pageKey: "connect",
    title: "Enquiry | Payana Trails",
    description: "Submit an enquiry about a journey with Payana Trails and we will get back to you shortly.",
  },
  "/connect/faqs": {
    pageKey: "connect/faqs",
    title: "FAQs | Payana Trails",
    description: "Frequently asked questions about Payana Trails journeys, bookings, and travel experiences.",
  },
  "/connect/refer": {
    pageKey: "connect",
    title: "Refer a Friend | Payana Trails",
    description: "Refer a friend to Payana Trails and earn travel credits for your next journey.",
  },
  "/connect/gift-a-journey": {
    pageKey: "connect",
    title: "Gift a Journey | Payana Trails",
    description: "Gift a meaningful travel experience to someone special with Payana Trails.",
  },
  "/privacy-policy": {
    pageKey: "privacy-policy",
    title: "Privacy Policy | Payana Trails",
    description: "Read the Privacy Policy of Payana Trails to understand how we collect, use, and protect your personal information.",
  },
  "/terms-and-conditions": {
    pageKey: "terms-and-conditions",
    title: "Terms-and-conditions",
    description: "Review the Terms and Conditions governing the use of Payana Trails services, website, and travel bookings.",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

// ── Serve React frontend (production) ────────────────────────────────────────
// In production the React app is built into ../frontend/dist. Express serves it
// so that the OG middleware (above) can intercept bot requests for every URL
// including the homepage and all trail pages — all from a single domain.
const FRONTEND_DIST = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(FRONTEND_DIST)) {
  // Serve static assets (JS, CSS, images). Prevent serving index.html automatically.
  app.use(express.static(FRONTEND_DIST, { index: false }));

  let indexHtmlCache = null;

  // SPA catch-all: every non-API, non-file route returns index.html
  app.get(/^(?!\/api|\/uploads).*$/, (req, res) => {
    if (!indexHtmlCache) {
      const indexPath = path.join(FRONTEND_DIST, "index.html");
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send("index.html not found");
      }
      indexHtmlCache = fs.readFileSync(indexPath, "utf8");
    }

    let html = indexHtmlCache;

    const siteUrl = "https://payanatrails.com";
    const reqPath = req.path === "/" ? "" : req.path;
    const fullUrl =
      req.path === "/"
        ? `${siteUrl}/`
        : `${siteUrl}${reqPath}`;

    // Look up page-specific meta; fall back to homepage defaults for unknown routes
    // (e.g. /trails/:slug — those get their meta injected by the React Helmet component)
    const meta = PAGE_META[req.path] || PAGE_META["/"];
    const pageKey = meta.pageKey || "home";
    // Replace ~ with / if needed, though pageKeys like journeys/wildlife shouldn't be encoded here
    // But the API route is /api/page-heroes/:pageKey/primary-image and expects URL encoding or ~
    // The API uses `decode(req.params.pageKey)` which replaces ~ with /.
    const apiPageKey = pageKey.replace(/\//g, "~");

    // Inject all SEO-relevant meta tags server-side so Googlebot sees the correct
    // values immediately without needing to execute JavaScript first.
    html = html
      // Canonical & og:url — always page-specific
      .replace(
        /<link rel="canonical" href="[^"]*" \/>/gi,
        `<link rel="canonical" href="${fullUrl}" />`
      )
      .replace(
        /<meta property="og:url" content="[^"]*" \/>/gi,
        `<meta property="og:url" content="${fullUrl}" />`
      )
      // Page title
      .replace(
        /<title>[^<]*<\/title>/i,
        `<title>${meta.title}</title>`
      )
      // Meta description
      .replace(
        /<meta name="description" content="[^"]*" \/>/i,
        `<meta name="description" content="${meta.description}" />`
      )
      // Open Graph title & description & image
      .replace(
        /<meta property="og:title" content="[^"]*" \/>/i,
        `<meta property="og:title" content="${meta.title}" />`
      )
      .replace(
        /<meta property="og:description" content="[^"]*" \/>/i,
        `<meta property="og:description" content="${meta.description}" />`
      )
      .replace(
        /<meta property="og:image" content="[^"]*" \/>/i,
        `<meta property="og:image" content="${siteUrl}/api/page-heroes/${encodeURIComponent(apiPageKey)}/primary-image" />`
      )
      // Twitter Card title & description & image
      .replace(
        /<meta name="twitter:title" content="[^"]*" \/>/i,
        `<meta name="twitter:title" content="${meta.title}" />`
      )
      .replace(
        /<meta name="twitter:description" content="[^"]*" \/>/i,
        `<meta name="twitter:description" content="${meta.description}" />`
      )
      .replace(
        /<meta name="twitter:image" content="[^"]*" \/>/i,
        `<meta name="twitter:image" content="${siteUrl}/api/page-heroes/${encodeURIComponent(apiPageKey)}/primary-image" />`
      );

    res.send(html);
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