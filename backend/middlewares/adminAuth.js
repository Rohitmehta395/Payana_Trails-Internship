const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim();
};

const requireAdmin = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: "Admin authorization required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("_id email");

    if (!admin) {
      return res.status(401).json({ message: "Admin account not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};

const requireAdminIfRequested = (req, res, next) => {
  if (req.query.admin === "true") {
    return requireAdmin(req, res, next);
  }

  return next();
};

module.exports = {
  requireAdmin,
  requireAdminIfRequested,
};
