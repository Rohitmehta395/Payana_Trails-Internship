/**
 * Simple middleware to add Cache-Control headers to API responses.
 * @param {number} seconds - Number of seconds to cache.
 */
const cacheMiddleware = (seconds) => {
  return (req, res, next) => {
    // Only cache GET requests and skip admin routes
    if (req.method === "GET" && !req.originalUrl.includes("/admin")) {
      res.set("Cache-Control", `public, max-age=${seconds}`);
    }
    next();
  };
};

module.exports = cacheMiddleware;
