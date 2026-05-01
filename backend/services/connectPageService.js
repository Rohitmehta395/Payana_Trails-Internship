const ConnectPage = require("../models/ConnectPage");
const fs = require("fs");

class ConnectPageService {
  async getConnectPage() {
    return await ConnectPage.findOne();
  }

  async updateConnectPage(data) {
    let connectPage = await ConnectPage.findOne();
    if (!connectPage) {
      connectPage = new ConnectPage(data);
    } else {
      connectPage.set(data);
    }
    return await connectPage.save();
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
      console.error("Failed to delete old image:", err);
    }
  }
}

module.exports = new ConnectPageService();
