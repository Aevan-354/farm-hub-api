const pool = require("../db"); // your PostgreSQL pool

// CREATE a new Land
const createLand = async (req, res) => {
  try {
    const { title, location, price, size, description } = req.body;
    const ownerId = req.user.id; // we get this from the auth middleware

    // Basic validation
    if (!title || !location || !price) {
      return res.status(400).json({ message: "title, location, and price are required" });
    }

    const query = `
      INSERT INTO lands (title, location, price, size, description, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [title, location, price, size, description, ownerId];

    const { rows } = await pool.query(query, values);
    res.status(201).json({
      message: "Land posted successfully",
      land: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET all Lands
const getAllLands = async (req, res) => {
  try {
    const query = "SELECT id, title, latitude, longitude FROM lands ORDER BY created_at DESC;";
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET single Land by ID
const getLandById = async (req, res) => {
  try {
    const landId = req.params.id;
    const query = `SELECT * FROM lands WHERE id = $1;`;
    const { rows } = await pool.query(query, [landId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Land not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createLand, getAllLands, getLandById };
