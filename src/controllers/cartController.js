const pool = require("../db");

// ADD LAND TO CART
const addToCart = async (req, res) => {
  try {
    const { land_id } = req.body;
    const user_id = req.user.id; // Get user from token

    // Validate input
    if (!land_id) {
      return res.status(400).json({ message: "Land ID is required" });
    }

    // Insert into cart (if not already added)
    const query = `
      INSERT INTO cart (user_id, land_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, land_id) DO NOTHING
      RETURNING *;
    `;
    const values = [user_id, land_id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Land is already in the cart" });
    }

    res.status(201).json({
      message: "Land added to cart",
      cartItem: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL CART ITEMS FOR A USER
const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT lands.* FROM lands
      JOIN cart ON lands.id = cart.land_id
      WHERE cart.user_id = $1;
    `;
    const { rows } = await pool.query(query, [user_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// REMOVE LAND FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { land_id } = req.params;
    const user_id = req.user.id;

    const query = "DELETE FROM cart WHERE user_id = $1 AND land_id = $2 RETURNING *;";
    const { rows } = await pool.query(query, [user_id, land_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Land not found in cart" });
    }

    res.status(200).json({ message: "Land removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addToCart, getCart, removeFromCart };
