const express = require("express");
const router = express.Router();
const pool = require("../db"); // Ensure this is correctly set up

// ✅ Add bid (POST)
router.post("/", async (req, res) => {
    
    try {
        const { land_id, bid_price, user_id} = req.body;
        
        const newLand = await pool.query(
            "INSERT INTO bids (land_id, bid_price, user_id) VALUES ($1, $2, $3) RETURNING *",
            [land_id, bid_price, user_id]
        );
        
        res.status(201).json(newLand.rows[0]);
    } catch ({message}) {
        console.log(req.body);
        console.error("Error Placeing bid:", message);
        res.status(400).json({ message });
    }
});

// ✅ Fetch User Bids Lands (GET)
router.get("/user/:user_id", async (req, res) => {  // ✅ This now matches your frontend request
    try {
        const bids = await pool.query("SELECT * FROM bids inner join lands on lands.id =land_id where user_id = $1", [req.params.user_id]);
        res.status(200).json(bids.rows);
    } catch ({message}) {
        res.status(500).json({ message});
    }
});

router.get("/land/:land_id", async (req, res) => {  // ✅ This now matches your frontend request
  try {
      const bids = await pool.query("SELECT * FROM bids inner join lands on lands.id =land_id where land_id = $1", [req.params.land_id]);
      res.status(200).json(bids.rows);
  } catch ({message}) {
      res.status(500).json({ message});
  }
});

module.exports = router; // ✅ Only one module.exports
