/**
 * OG (Open Graph) Middleware
 *
 * Social media bots (WhatsApp, Telegram, Twitter, etc.) read <meta> OG tags
 * from the raw HTML of a page. Since this is a React SPA, the HTML is static
 * and bots never see the dynamic data. This middleware detects those bots and
 * serves a lightweight HTML page with the correct OG tags injected from the DB.
 *
 * Regular users are served the normal React app (index.html or Vite dev server).
 */

const Trail = require("../models/Trail");
const PageHeroImage = require("../models/PageHeroImage");

// User-agents used by social media link-preview crawlers
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

const STATIC_PAGE_META = {
  "/": {
    pageKey: "home",
    title: "Payana Trails | Thoughtfully Designed Journeys",
    description:
      "Small groups. Deeper experiences. Discover our curated trails around the world.",
  },
  "/home": {
    pageKey: "home",
    title: "Payana Trails | Thoughtfully Designed Journeys",
    description:
      "Small groups. Deeper experiences. Discover our curated trails around the world.",
  },
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
};

function isBot(userAgent = "") {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((b) => ua.includes(b.toLowerCase()));
}

function buildOGHtml({ title, description, imageUrl, pageUrl }) {
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(title)}</title>

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Payana Trails" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${esc(pageUrl)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(imageUrl)}" />

  <meta http-equiv="refresh" content="0; url=${esc(pageUrl)}" />
</head>
<body>
  <p>Redirecting to <a href="${esc(pageUrl)}">${esc(title)}</a>...</p>
  <script>window.location.replace("${pageUrl.replace(/"/g, '\\"')}");</script>
</body>
</html>`;
}

function normalizePath(pathname = "/") {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed || "/";
}

function toAbsoluteUrl(base, value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
}

function buildPageUrl(siteUrl, originalUrl = "/") {
  const safeOriginal = originalUrl.startsWith("/") ? originalUrl : `/${originalUrl}`;
  return safeOriginal === "/" ? siteUrl : `${siteUrl}${safeOriginal}`;
}

function pickPrimaryHeroImage(images = []) {
  return [...images]
    .filter((img) => img?.isActive && img?.url)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
}

module.exports = async function ogMiddleware(req, res, next) {
  if (req.method !== "GET" || !isBot(req.headers["user-agent"])) {
    return next();
  }

  const SITE_URL = process.env.SITE_URL || "http://localhost:5173";
  const IMAGE_BASE =
    process.env.IMAGE_BASE_URL || `http://localhost:${process.env.PORT || 8000}`;

  const normalizedPath = normalizePath(req.path);
  const pageUrl = buildPageUrl(SITE_URL, req.originalUrl || normalizedPath);

  const staticPageMeta = STATIC_PAGE_META[normalizedPath];
  if (staticPageMeta) {
    try {
      const pageDoc = await PageHeroImage.findOne({ pageKey: staticPageMeta.pageKey })
        .select("images")
        .lean();
      const primaryHero = pickPrimaryHeroImage(pageDoc?.images || []);
      const imageUrl = primaryHero?.url
        ? toAbsoluteUrl(IMAGE_BASE, primaryHero.url)
        : `${IMAGE_BASE}/heroBg-desktop.webp`;

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
    }
  }

  const trailMatch = normalizedPath.match(/^\/trails\/([^/]+)$/);
  if (trailMatch) {
    const slug = trailMatch[1];

    try {
      let trail = await Trail.findOne({
        slug,
        isActive: true,
        status: "published",
      })
        .select("trailName overview heroImage slug")
        .lean();

      if (!trail) {
        const all = await Trail.find({ isActive: true, status: "published" })
          .select("trailName overview heroImage slug")
          .lean();

        trail = all.find((t) => {
          const normalizedSlug = (t.trailName || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          return normalizedSlug === slug;
        });
      }

      if (trail) {
        const heroImageUrl = trail.heroImage
          ? toAbsoluteUrl(IMAGE_BASE, trail.heroImage)
          : `${IMAGE_BASE}/heroBg-desktop.webp`;

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

  next();
};
