const pool = require("../db.js");

class Land {
  static async create(owner_id, title, description, location, size, price) {
    const result = await pool.query(
      "INSERT INTO lands (owner_id, title, description, location, size, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [owner_id, title, description, location, size, price]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query("SELECT * FROM lands WHERE available = true");
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query("SELECT * FROM lands WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query("DELETE FROM lands WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
}

module.exports = Land;
