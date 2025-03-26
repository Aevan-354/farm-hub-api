const express = require("express");
const router = express.Router();
const pool = require("../db");

// Example GET request for weather
router.get("/", (req, res) => {
  res.json({ message: "Weather route working" });
});

module.exports = router;
