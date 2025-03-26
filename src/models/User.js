const pool = require("../db"); // Ensure you have a db.js file that exports your PostgreSQL pool

// Create Users table if not exists
const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
};

createUserTable().catch(err => console.error("Error creating users table:", err));

const createUser = async (username, email, password) => {
    const query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [username, email, password];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0];
};

module.exports = { createUser, getUserByEmail };
