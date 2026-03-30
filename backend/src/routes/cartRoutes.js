const express = require("express");
const { getCart, upsertCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/:userId", getCart);
router.put("/:userId", upsertCart);

module.exports = router;
