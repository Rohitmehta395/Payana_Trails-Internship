/**
 * OG (Open Graph) Middleware
 *
 * Social media bots (WhatsApp, Telegram, Twitter, etc.) read <meta> OG tags
 * from the raw HTML of a page. Since this is a React SPA, the HTML is static
 * and bots never see the dynamic data. This middleware detects those bots and
 * serves a lightweight HTML page with the correct OG tags injected from the DB.
 *
 * Regular users are served the normal React app (index.html or Vite dev server).
 *
 * ── OG Image Resolution Order ────────────────────────────────────────────────
 *  1. First *active* hero image from PageHeroImage DB (sorted by `order`)
 *  2. Page-specific fallback from PAGE_FALLBACK_OG_IMAGES (matches what the
 *     user actually sees as the visual hero on that page)
 *  3. Global final safety-net: /heroBg-desktop.webp
 *
 * ── Cache-Control ────────────────────────────────────────────────────────────
 *  We instruct our server NOT to cache stale DB data. WhatsApp/Facebook may
 *  still cache the preview externally (that's outside our control), but every
 *  fresh bot crawl will get the latest DB image.
 *
 * ── Verification (curl commands) ─────────────────────────────────────────────
 *  Replace <HOST> with http://localhost:8000 (dev) or https://payanatrails.com (prod).
 *
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/home"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/journeys"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/journey"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/payana-way"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/stories"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/stories/blogs"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/connect"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/journeys/destinations"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/journeys/signature"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/journeys/heritage"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/journeys/cultural"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/journeys/wildlife"
 *  curl -A "WhatsApp/2.24.6.75 A" "<HOST>/trails/the-soul-of-vietnam-trail"
 *
 *  Each response should contain <meta property="og:image" content="…"> with
 *  an absolute URL pointing to the correct hero image (or its page fallback).
 */

const Trail = require("../models/Trail");
const PageHeroImage = require("../models/PageHeroImage");
const Blog = require("../models/Blog");

// ── Bot Detection ─────────────────────────────────────────────────────────────
// User-agents used by social media link-preview crawlers.
const BOT_PATTERNS = [
  "facebookexternalhit",
  "facebookcatalog",
  "Facebot",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "TelegramBot",
  "Slackbot",
  "Discordbot",
  "Pinterest",
  "bingbot",
  "Googlebot",
  "Applebot",
  "redditbot",
  "Snapchat",
  "vkShare",
  "W3C_Validator",
  "ia_archiver",
];

// ── Static Page Metadata ──────────────────────────────────────────────────────
// pageKey must exactly match the `pageKey` field in the PageHeroImage collection.
//
// Expected OG image = first active hero image in DB for that pageKey.
// If no DB image exists → PAGE_FALLBACK_OG_IMAGES[pageKey] (see below).
const STATIC_PAGE_META = {
  // ── Home ──────────────────────────────────────────────────────────────────
  "/": {
    pageKey: "home",
    title: "Payana Trails | Journeys, thoughtfully curated!",
    description:
      "Small groups. Deeper experiences. Discover our curated trails around the world.",
  },
  "/home": {
    pageKey: "home",
    title: "Payana Trails | Journeys, thoughtfully curated!",
    description:
      "Small groups. Deeper experiences. Discover our curated trails around the world.",
  },

  // ── Journeys ──────────────────────────────────────────────────────────────
  "/journeys": {
    pageKey: "journeys",
    title: "Journeys | Payana Trails",
    description:
      "Explore signature, wildlife, heritage, cultural, and destination-led journeys thoughtfully designed by Payana Trails.",
  },
  "/journey": {
    pageKey: "journeys",
    title: "Journeys | Payana Trails",
    description:
      "Explore signature, wildlife, heritage, cultural, and destination-led journeys thoughtfully designed by Payana Trails.",
  },

  // ── Sub-journeys ──────────────────────────────────────────────────────────
  "/journeys/signature": {
    pageKey: "journeys/signature",
    title: "Signature Trails | Payana Trails",
    description:
      "A handpicked collection of Payana Trails journeys with unforgettable landscapes, stories, and experiences.",
  },
  "/journeys/wildlife": {
    pageKey: "journeys/wildlife",
    title: "Wildlife Trails | Payana Trails",
    description:
      "Explore wildlife journeys where every sighting unfolds at nature's pace, with comfort and depth.",
  },
  "/journeys/heritage": {
    pageKey: "journeys/heritage",
    title: "Heritage Trails | Payana Trails",
    description:
      "Discover stories, architecture, and living legacies that have shaped civilisations across time.",
  },
  "/journeys/cultural": {
    pageKey: "journeys/cultural",
    title: "Cultural & Immersive Trails | Payana Trails",
    description:
      "Meaningful encounters that connect you with the people, traditions, and spirit of each destination.",
  },
  "/journeys/destinations": {
    pageKey: "journeys/destinations",
    title: "Destinations | Payana Trails",
    description:
      "Explore handpicked destinations that open the door to extraordinary journeys and deeper travel experiences.",
  },

  // ── Payana Way ────────────────────────────────────────────────────────────
  "/payana-way": {
    pageKey: "payana-way",
    title: "The Payana Way | Payana Trails",
    description:
      "Discover the philosophy behind Payana Trails — journeys built on depth, purpose, and meaningful human connections.",
  },

  // ── Stories ───────────────────────────────────────────────────────────────
  "/stories": {
    pageKey: "stories",
    title: "Stories | Payana Trails",
    description:
      "Reflections, insights, and moments from journeys across the world. Discover the spirit of travel through our stories.",
  },
  "/stories/blogs": {
    pageKey: "stories",
    title: "Travel Stories | Payana Trails",
    description:
      "Reflections, insights, and moments from journeys across the world. Discover the spirit of travel through our stories.",
  },
  "/stories/external": {
    pageKey: "stories",
    title: "Stories from Our Guests | Payana Trails",
    description:
      "Guest stories and reflections from travellers who have experienced journeys with Payana Trails.",
  },
  "/stories/testimonials": {
    pageKey: "stories",
    title: "Voices from the Trail | Payana Trails",
    description:
      "Read testimonials and voices from travellers who have journeyed with Payana Trails.",
  },

  // ── Connect ───────────────────────────────────────────────────────────────
  "/connect": {
    pageKey: "connect",
    title: "Connect | Payana Trails",
    description:
      "Reach out to us. Enquire about a journey, send a referral, or simply say hello — we'd love to hear from you.",
  },
};

// ── Page-Specific Fallback OG Images ─────────────────────────────────────────
// These MUST match the visual fallback hero image that a real user sees on each
// page when the DB returns no active images.
//
// Images in /public are served by the Express static middleware (or, in
// production, from the React build's dist folder). They are accessible at the
// root of the site: https://payanatrails.com/<filename>.
//
// How each fallback was determined:
//   home              → public/heroBg-desktop.webp  (Home Hero default)
//   journeys          → Unsplash URL  (Journey Hero defaultImages[0])
//   payana-way        → public/og-payana-way.webp   (copied from src/assets)
//   stories           → public/og-stories.webp      (copied from src/assets)
//   connect           → public/heroBg-desktop.webp  (no bgImage in Connect.jsx)
//   journeys/destinations → public/og-destinations.webp
//   journeys/signature    → public/og-destinations.webp (same Destination_Main)
//   journeys/heritage     → public/og-heritage.webp
//   journeys/cultural     → public/og-cultural.webp
//   journeys/wildlife     → public/og-wildlife.avif
//   trail             → public/heroBg-desktop.webp  (TrailDetails.jsx line ~79)
//   blog              → public/og-stories.webp      (stories page fallback)
const PAGE_FALLBACK_OG_IMAGES = {
  home: "/heroBg-desktop.webp",
  journeys:
    "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  "payana-way": "/og-payana-way.webp",
  stories: "/og-stories.webp",
  connect: "/heroBg-desktop.webp",
  "journeys/destinations": "/og-destinations.webp",
  "journeys/signature": "/og-destinations.webp",
  "journeys/heritage": "/og-heritage.webp",
  "journeys/cultural": "/og-cultural.webp",
  "journeys/wildlife": "/og-wildlife.avif",
};

// Final safety-net used when no page-specific fallback exists (e.g. unknown pageKey)
const GLOBAL_FALLBACK_OG_IMAGE = "/heroBg-desktop.webp";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isBot(userAgent = "") {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((b) => ua.includes(b.toLowerCase()));
}

/**
 * Escape HTML special characters for safe injection into attribute values / text.
 */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Build the lightweight HTML page that social bots consume.
 * Contains all required OG + Twitter Card tags plus a JS redirect for any
 * human who accidentally lands here.
 */
function buildOGHtml({ title, description, imageUrl, pageUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(title)}</title>

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="Payana Trails" />
  <meta property="og:title"       content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image"       content="${esc(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url"         content="${esc(pageUrl)}" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image"       content="${esc(imageUrl)}" />

  <!-- Redirect real users back to the SPA immediately -->
  <meta http-equiv="refresh" content="0; url=${esc(pageUrl)}" />
</head>
<body>
  <p>Redirecting to <a href="${esc(pageUrl)}">${esc(title)}</a>…</p>
  <script>window.location.replace("${pageUrl.replace(/"/g, '\\"')}");</script>
</body>
</html>`;
}

/** Strip trailing slashes; keep bare "/" as-is. */
function normalizePath(pathname = "/") {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed || "/";
}

/**
 * Convert a relative image path ("/uploads/foo.webp") to an absolute URL.
 * Absolute URLs (already starting with http/https) are returned unchanged.
 */
function toAbsoluteUrl(base, value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
}

function stripTrailingSlash(value = "") {
  return value.replace(/\/+$/, "");
}

function getRequestOrigin(req) {
  const forwardedProto = req.get("x-forwarded-proto");
  const forwardedHost = req.get("x-forwarded-host");
  const proto = (forwardedProto || req.protocol || "http").split(",")[0].trim();
  const host = (forwardedHost || req.get("host") || "").split(",")[0].trim();

  return host ? `${proto}://${host}` : "";
}

/** Build the canonical page URL for og:url. */
function buildPageUrl(siteUrl, originalUrl = "/") {
  const safe = originalUrl.startsWith("/") ? originalUrl : `/${originalUrl}`;
  return safe === "/" ? siteUrl : `${siteUrl}${safe}`;
}

/**
 * From a PageHeroImage `images` array, pick the first active image (sorted by
 * `order` ascending).  Returns the image sub-document or undefined.
 */
function pickPrimaryHeroImage(images = []) {
  return [...images]
    .filter((img) => img?.isActive && img?.url)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
}

// ── Middleware ────────────────────────────────────────────────────────────────

module.exports = async function ogMiddleware(req, res, next) {
  // Only intercept GET requests from known social crawlers.
  // Every other request (regular users, API calls, etc.) passes through.
  if (req.method !== "GET" || !isBot(req.headers["user-agent"])) {
    return next();
  }

  const requestOrigin = getRequestOrigin(req);
  const SITE_URL = stripTrailingSlash(
    process.env.SITE_URL || requestOrigin || "http://localhost:5173"
  );
  const IMAGE_BASE = stripTrailingSlash(
    process.env.IMAGE_BASE_URL ||
      process.env.SITE_URL ||
      requestOrigin ||
      `http://localhost:${process.env.PORT || 8000}`
  );

  // Instruct our server NOT to serve stale DB data.
  // WhatsApp/Facebook will still maintain their own external cache — we
  // cannot control that — but each fresh bot crawl gets live DB data.
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  const normalizedPath = normalizePath(req.path);
  const pageUrl = buildPageUrl(SITE_URL, req.originalUrl || normalizedPath);

  // ── 1. Static pages ────────────────────────────────────────────────────────
  const staticPageMeta = STATIC_PAGE_META[normalizedPath];
  if (staticPageMeta) {
    try {
      const pageDoc = await PageHeroImage.findOne({
        pageKey: staticPageMeta.pageKey,
      })
        .select("images")
        .lean();

      const primaryHero = pickPrimaryHeroImage(pageDoc?.images || []);

      // Fallback: use the page-specific image that the user actually sees,
      // not a one-size-fits-all generic placeholder.
      const fallbackImage =
        PAGE_FALLBACK_OG_IMAGES[staticPageMeta.pageKey] ||
        GLOBAL_FALLBACK_OG_IMAGE;

      const imageUrl = primaryHero?.url
        ? toAbsoluteUrl(IMAGE_BASE, primaryHero.url)
        : toAbsoluteUrl(IMAGE_BASE, fallbackImage);

      return res.send(
        buildOGHtml({
          title: staticPageMeta.title,
          description: staticPageMeta.description,
          imageUrl,
          pageUrl,
        })
      );
    } catch (err) {
      console.error("[OG Middleware] Error fetching page hero:", err.message);
      // Fall through to next() on DB error so the user still gets the SPA.
    }
  }

  // ── 2. Trail detail pages  /trails/:slug ────────────────────────────────────
  const trailMatch = normalizedPath.match(/^\/trails\/([^/]+)$/);
  if (trailMatch) {
    const slug = trailMatch[1];

    try {
      // Primary lookup: by stored slug field (fast, indexed)
      let trail = await Trail.findOne({
        slug,
        isActive: true,
        status: "published",
      })
        .select("trailName overview heroImage slug")
        .lean();

      // Fallback: derive slug from trailName for older records that may not
      // have a stored slug matching the URL format exactly.
      if (!trail) {
        const allTrails = await Trail.find({
          isActive: true,
          status: "published",
        })
          .select("trailName overview heroImage slug")
          .lean();

        trail = allTrails.find((t) => {
          const derived = (t.trailName || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          return derived === slug;
        });
      }

      if (trail) {
        // OG image: trail.heroImage from DB.
        // Fallback: same image TrailDetails.jsx shows when heroImage is missing
        // (see TrailDetails.jsx – ogImage line: `|| \`${SITE_URL}/heroBg-desktop.webp\``)
        const trailFallback = "/heroBg-desktop.webp";
        const heroImageUrl = trail.heroImage
          ? toAbsoluteUrl(IMAGE_BASE, trail.heroImage)
          : toAbsoluteUrl(IMAGE_BASE, trailFallback);

        const description = (
          trail.overview || "Discover this amazing trail with Payana Trails."
        )
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 160);

        return res.send(
          buildOGHtml({
            title: `${trail.trailName} | Payana Trails`,
            description,
            imageUrl: heroImageUrl,
            pageUrl,
          })
        );
      }
    } catch (err) {
      console.error("[OG Middleware] Error fetching trail:", err.message);
    }
  }

  // ── 3. Blog / Story detail pages  /stories/blogs/:slug ────────────────────
  const blogMatch = normalizedPath.match(/^\/stories\/blogs\/([^/]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    try {
      const blog = await Blog.findOne({ slug, isDraft: false })
        .select("title excerpt featuredImage")
        .lean();

      if (blog) {
        // OG image: blog's own featuredImage, or fall back to the Stories
        // page hero fallback (not a generic unrelated image).
        const blogFallback =
          PAGE_FALLBACK_OG_IMAGES["stories"] || GLOBAL_FALLBACK_OG_IMAGE;

        const imageUrl = blog.featuredImage
          ? toAbsoluteUrl(IMAGE_BASE, blog.featuredImage)
          : toAbsoluteUrl(IMAGE_BASE, blogFallback);

        return res.send(
          buildOGHtml({
            title: `${blog.title} | Payana Trails`,
            description:
              blog.excerpt || "A story from the heart of Payana Trails.",
            imageUrl,
            pageUrl,
          })
        );
      }
    } catch (err) {
      console.error(
        "[OG Middleware] Error fetching blog for OG:",
        err.message
      );
    }
  }

  // ── 4. No match — pass to the next handler (static files / SPA) ────────────
  next();
};
