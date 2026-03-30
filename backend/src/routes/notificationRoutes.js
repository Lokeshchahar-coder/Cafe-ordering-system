const express = require("express");
const { sendThankYouNote } = require("../controllers/notificationController");

const router = express.Router();

router.post("/thank-you", sendThankYouNote);

module.exports = router;
