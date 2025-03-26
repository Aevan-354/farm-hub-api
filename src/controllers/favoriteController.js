const pool = require("../db");

// ADD LAND TO FAVORITES
const addFavorite = async (req, res) => {
  try {
    const { land_id } = req.body;
    const user_id = req.user.id; // Get user from token

    // Validate input
    if (!land_id) {
      return res.status(400).json({ message: "Land ID is required" });
    }

    // Insert into favorites (if not already favorited)
    const query = `
      INSERT INTO favorites (user_id, land_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, land_id) DO NOTHING
      RETURNING *;
    `;
    const values = [user_id, land_id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Land is already in favorites" });
    }

    res.status(201).json({
      message: "Land added to favorites",
      favorite: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL FAVORITE LANDS OF THE LOGGED-IN USER
const getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT lands.* FROM lands
      JOIN favorites ON lands.id = favorites.land_id
      WHERE favorites.user_id = $1;
    `;
    const { rows } = await pool.query(query, [user_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addFavorite, getFavorites };
