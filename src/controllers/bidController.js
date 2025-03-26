const pool = require("../db");

// PLACE A BID
const placeBid = async (req, res) => {
  try {
    const { land_id, amount } = req.body;
    const user_id = req.user.id; // Get from token

    // Validate input
    if (!land_id || !amount) {
      return res.status(400).json({ message: "Land ID and bid amount are required" });
    }

    // Insert the bid into the database
    const query = `
      INSERT INTO bids (land_id, user_id, amount)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [land_id, user_id, amount];
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: "Bid placed successfully",
      bid: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET HIGHEST BID FOR A LAND
const getHighestBid = async (req, res) => {
  try {
    const land_id = req.params.land_id;

    const query = `
      SELECT * FROM bids 
      WHERE land_id = $1 
      ORDER BY amount DESC 
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [land_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No bids found for this land" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { placeBid, getHighestBid };
