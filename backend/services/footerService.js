const Footer = require("../models/Footer");
const fs = require("fs");

class FooterService {
  async getFooter() {
    return await Footer.findOne();
  }

  async updateFooter(data) {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = new Footer(data);
    } else {
      footer.set(data);
    }
    return await footer.save();
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
      console.error("Failed to delete old footer logo:", err);
    }
  }
}

module.exports = new FooterService();
