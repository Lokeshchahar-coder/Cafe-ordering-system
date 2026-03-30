const express = require("express");
const { getMenu, createMenuItem } = require("../controllers/menuController");
const { adminMiddleware } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getMenu);
router.post("/", adminMiddleware, createMenuItem);

module.exports = router;
