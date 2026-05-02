const Header = require("../models/Header");
const fs = require("fs");

class HeaderService {
  async getHeader() {
    return await Header.findOne();
  }

  async updateHeader(data) {
    let header = await Header.findOne();
    if (!header) {
      header = new Header(data);
    } else {
      header.set(data);
    }
    return await header.save();
  }

  deleteOldImage(url) {
    if (!url) return;
    try {
      const { resolveUploadPath } = require("../middlewares/processImage");
      const fullPath = resolveUploadPath(url);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error("Failed to delete old header logo:", err);
    }
  }
}

module.exports = new HeaderService();
