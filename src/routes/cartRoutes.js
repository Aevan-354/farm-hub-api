const express = require("express");
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");
const authenticate = require("../middleware/authMiddleware");

// Add land to cart (protected)
router.post("/", authenticate, addToCart);

// Get all cart items for a user
router.get("/", authenticate, getCart);

// Remove land from cart
router.delete("/:land_id", authenticate, removeFromCart);

module.exports = router;
