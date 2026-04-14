const express = require("express");
const router = express.Router();
const { subscribe, unsubscribe } = require("../controllers/newsletterController");

router.post("/subscribe", subscribe);
router.get("/unsubscribe/:token", unsubscribe);

module.exports = router;
