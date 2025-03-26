const express = require("express");
const router = express.Router();
const { addToComparison, getComparison, removeFromComparison } = require("../controllers/comparisonController");
const authenticate = require("../middleware/authMiddleware");

// Add land to comparison (protected)
router.post("/", authenticate, addToComparison);

// Get all comparison lands for a user
router.get("/", authenticate, getComparison);

// Remove land from comparison
router.delete("/:land_id", authenticate, removeFromComparison);

module.exports = router;
