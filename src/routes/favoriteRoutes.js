const express = require("express");
const router = express.Router();
const { addFavorite, getFavorites } = require("../controllers/favoriteController");
const authenticate = require("../middleware/authMiddleware");

// Add a favorite land (protected)
router.post("/", authenticate, addFavorite);

// Get all favorite lands of the logged-in user
router.get("/", authenticate, getFavorites);

module.exports = router;
