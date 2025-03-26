const pool = require("../db");

// ADD LAND TO COMPARISON LIST (ONLY FROM FAVORITES OR CART)
const addToComparison = async (req, res) => {
  try {
    const { land_id } = req.body;
    const user_id = req.user.id; // Get user from token

    // Validate input
    if (!land_id) {
      return res.status(400).json({ message: "Land ID is required" });
    }

    // Check if land is in favorites or cart
    const checkQuery = `
      SELECT * FROM favorites WHERE user_id = $1 AND land_id = $2
      UNION
      SELECT * FROM cart WHERE user_id = $1 AND land_id = $2;
    `;
    const checkResult = await pool.query(checkQuery, [user_id, land_id]);

    if (checkResult.rows.length === 0) {
      return res.status(400).json({ message: "Land must be in favorites or cart to compare" });
    }

    // Insert into comparison
    const insertQuery = `
      INSERT INTO comparison (user_id, land_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, land_id) DO NOTHING
      RETURNING *;
    `;
    const insertResult = await pool.query(insertQuery, [user_id, land_id]);

    if (insertResult.rows.length === 0) {
      return res.status(400).json({ message: "Land is already in comparison list" });
    }

    res.status(201).json({
      message: "Land added to comparison",
      comparisonItem: insertResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL LANDS IN COMPARISON (WITH DETAILED INFO)
const getComparison = async (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT lands.* FROM lands
      JOIN comparison ON lands.id = comparison.land_id
      WHERE comparison.user_id = $1;
    `;
    const { rows } = await pool.query(query, [user_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// REMOVE LAND FROM COMPARISON
const removeFromComparison = async (req, res) => {
  try {
    const { land_id } = req.params;
    const user_id = req.user.id;

    const query = "DELETE FROM comparison WHERE user_id = $1 AND land_id = $2 RETURNING *;";
    const { rows } = await pool.query(query, [user_id, land_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Land not found in comparison list" });
    }

    res.status(200).json({ message: "Land removed from comparison" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addToComparison, getComparison, removeFromComparison };
