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
        
        return res.status(201).json(newLand.rows[0]);
    } catch ({message}) {
        console.error("Error Placeing bid:", message);
        return res.status(400).json({ message });
    }
});

router.put("/:id", async (req, res) => {
    try {
      const bidId =req.params.id
      const {bidder_id, status, won, bid_price} =req.body

      const bidFound = (await pool.query("SELECT * FROM bids WHERE id = $1", [bidId])).rows.at(0);
      if (!bidFound) {
          return res.status(404).json({ message: "Bid not found" });
      }
  
      if(bidder_id){
          await pool.query('UPDATE bids SET password = $1 WHERE id = $2', [hashedPassword, userId])
      }
  
      if(profile_image){
          await pool.query('UPDATE users SET profile_image = $1 WHERE id = $2', [profile_image, userId])
      }
  
      const profile_pic =profile_image ?? userFound.profile_image
      delete userFound.password
      res.status(200).json({
        message: `${newPassword && !profile_image? 'Password updated successfully': !newPassword && profile_image? 'Profile Picture updated': 'Details updated successfully' }`,
        user: {
          ...userFound,
          profile_image: profile_pic
        }
      });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

// ✅ Fetch User Bids Lands (GET)
router.get("/user/:user_id", async (req, res) => {
    const userId = req.params.user_id;

    // Validate user_id is a positive integer
    if (!Number.isInteger(Number(userId)) || userId <= 0) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid user ID format" 
        });
    }

    try {
        const query = `
            SELECT 
                bids.id AS bid_id,
                bids.bid_price,
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
            FROM bids
            INNER JOIN lands ON lands.id = bids.land_id
            WHERE bids.user_id = $1
            ORDER BY lands.created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);

        return res.status(200).json(result.rows);

    } catch (err) {
        console.error("Error fetching user bids:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user bids",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

router.get("/land/:land_id", async (req, res) => {
  try {
    const query = `
            SELECT 
                bids.id AS bid_id,
                bids.bid_price,
                users.username,
                users.id as bidder_id,
                lands.id,
                lands.title,
                lands.location,
                lands.image_url,
                lands.created_at
            FROM bids
            INNER JOIN lands ON lands.id = bids.land_id
            INNER JOIN users ON bids.user_id = users.id
            WHERE lands.id = $1
            ORDER BY lands.created_at DESC
        `;
      const bids = await pool.query(query, [req.params.land_id]);
      return res.status(200).json(bids.rows);
  } catch ({message}) {
      return res.status(500).json({ message});
  }
});

router.delete("/:bidId", async (req, res) => {
    const { bidId } = req.params;
    if (!Number.isInteger(Number(bidId)) || bidId <= 0) {
        return res.status(400).json({ message: "Invalid bid ID" });
    }

    try {
        const result = await pool.query(
            "DELETE FROM bids WHERE id = $1 RETURNING *", 
            [bidId]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Bid not found" });
        }
        
        return res.status(204).end();
    } catch (err) {
        console.error("Error deleting bid:", err);
        return res.status(500).json({ 
            message: "Failed to delete bid",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router; // ✅ Only one module.exports
