const express = require("express");
const router = express.Router();
const { initiateMpesaPayment, handleMpesaCallback } = require("../controllers/paymentController");
const authenticate = require("../middleware/authMiddleware");

// ✅ Initiate M-Pesa Payment
router.post("/mpesa", authenticate, initiateMpesaPayment);

// ✅ Handle M-Pesa Callback
router.post("/mpesa/callback", handleMpesaCallback);

module.exports = router;
