const HomePage = require("../models/HomePage");
const fs = require("fs");
const path = require("path");

class HomePageService {
  async getHomePage() {
    return await HomePage.findOne();
  }

  async updateHomePage(data) {
    let homePage = await HomePage.findOne();
    if (!homePage) {
      homePage = new HomePage(data);
    } else {
      homePage.set(data);
    }
    return await homePage.save();
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

module.exports = new HomePageService();
