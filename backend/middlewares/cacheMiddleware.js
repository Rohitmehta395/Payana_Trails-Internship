/**
 * Simple middleware to add Cache-Control headers to API responses.
 * @param {number} seconds - Number of seconds to cache.
 */
const cacheMiddleware = (seconds) => {
  return (req, res, next) => {
    // Only cache GET requests
    // Skip caching if:
    // 1. It's not a GET request
    // 2. The URL includes "/admin"
    // 3. There is an Authorization header (e.g., an admin is logged in)
    if (
      req.method === "GET" &&
      !req.originalUrl.includes("/admin") &&
      !req.headers.authorization
    ) {
      res.set("Cache-Control", `public, max-age=${seconds}`);
    } else {
      // For admin requests or non-GET, ensure no caching
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
    }
    next();
  };
};  

module.exports = cacheMiddleware;
