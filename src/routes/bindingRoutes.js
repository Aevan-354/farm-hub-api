const express = require("express");
const router = express.Router();
const Binding = require("../models/Binding");

// ✅ GET all bindings
router.get("/", async (req, res) => {
    try {
        const bindings = await Binding.findAll(); // Ensure this matches your ORM (e.g., Sequelize)
        res.status(200).json(bindings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
