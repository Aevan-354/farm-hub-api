const express = require("express");
const router = express.Router();
const pool = require("../db"); // Ensure this is correctly set up

// ✅ Add Land (POST)
router.post("/lands", async (req, res) => {
    console.log(req.body); // ✅ Ensure you can see the form data
    
    try {
        const { title, description, location, price, size, owner_id, image_url } = req.body;
        
        const newLand = await pool.query(
            "INSERT INTO lands (title, description, location, price, size, owner_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [title, description, location, price, size, owner_id, image_url]
        );
        
        res.status(201).json(newLand.rows[0]);
    } catch (err) {
        console.error("Error adding land:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Fetch All Lands (GET)
router.get("/lands", async (req, res) => {  // ✅ This now matches your frontend request
    try {
        const allLands = await pool.query("SELECT * FROM lands");
        res.status(200).json(allLands.rows);
    } catch (err) {
        console.error("Error fetching lands:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Fetch All availablq Lands (GET)
router.get("/lands/available", async (req, res) => {  // ✅ This now matches your frontend request
    try {
        const availableLands = await pool.query("SELECT * FROM lands inner join bids on lands.id =bids.land_id where available = true");
        res.status(200).json(availableLands.rows);
    } catch (err) {
        console.error("Error fetching lands:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router; // ✅ Only one module.exports
