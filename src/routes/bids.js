const express = require("express");
const router = express.Router();
const pool = require("../db");

// Example GET request
router.get("/", (req, res) => {
  res.json({ message: "Bidding system working" });
});

module.exports = router;
