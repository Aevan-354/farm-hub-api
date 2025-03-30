const express = require("express");
const router = express.Router();
const pool = require("../db"); // Ensure this is correctly set up

// ✅ Add Land (POST)
router.post("/lands", async (req, res) => {
    console.log(req.body); // ✅ Ensure you can see the form data
    
    try {
        const { title, description, location, price, size, owner_id, image_url, soilType, roadAccess, waterAvailability, electricity, marketFacilities, internetAvailability } = req.body;
        
        const newLand = await pool.query(
            "INSERT INTO lands (title, description, location, price, size, owner_id, image_url, soilType, roadAccess, waterAvailability, electricity, marketFacilities, internetAvailability) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
            [title, description, location, price, size, owner_id, image_url, soilType, roadAccess, waterAvailability, electricity, marketFacilities, internetAvailability]
        );
        
        res.status(201).json(newLand.rows[0]);
    } catch (err) {
        console.error("Error adding land:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Add land to marketplace
router.post("/lands/market-place/:landId", async (req, res) => {
    try {
        const landId =Number(req.params.landId)
        const {is_in_marketplace} =req.body
        await pool.query("UPDATE lands SET is_in_marketplace = $1 WHERE  id = $2", [is_in_marketplace, landId]);
        res.status(200).json({message: 'Your land has been listed for bidding'});
    } catch (err) {
        console.error("Error fetching lands:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Fetch marketplace
router.get("/lands/market-place", async (req, res) => {  // ✅ This now matches your frontend request
    try {
        const query =`
            SELECT 
                bids.id AS bid_id,
                bids.bid_price,
                bids.user_id,
                bids.status,
                bids.won,
                lands.id,
                lands.title,
                lands.location,
                lands.price,
                lands.size,
                lands.description,
                lands.image_url,
                lands.created_at,
                lands.available
            FROM lands
            LEFT JOIN bids ON lands.id = bids.land_id
            WHERE is_in_marketplace = true
            ORDER BY lands.created_at DESC
        `;
        const availableLands = await pool.query(query);
        res.status(200).json(availableLands.rows);
    } catch (err) {
        console.error("Error fetching lands:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Fetch marketplace
router.get("/lands", async (req, res) => {  // ✅ This now matches your frontend request
    try {
        const availableLands = await pool.query("SELECT * FROM lands");
        res.status(200).json(availableLands.rows);
    } catch (err) {
        console.error("Error fetching lands:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router; // ✅ Only one module.exports
