const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const { trackOrder } = require("../controllers/trackController");

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/track/:orderId", trackOrder);

module.exports = router;
