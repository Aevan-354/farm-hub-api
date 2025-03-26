const express = require('express');
const router = express.Router();

router.post('/callback', (req, res) => {
    console.log("M-Pesa STK Push Callback:", req.body);
    res.json({ message: "Payment received" });
});

module.exports = router;
