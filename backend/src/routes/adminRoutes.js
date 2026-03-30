const express = require("express");
const { getDashboardStats } = require("../controllers/adminController");
const { adminMiddleware } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/stats", adminMiddleware, getDashboardStats);

module.exports = router;
