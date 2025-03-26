const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // Adjust the path if needed
require("dotenv").config();

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user already exists
    const userCheckQuery = "SELECT * FROM users WHERE email = $1";
    const userCheckResult = await pool.query(userCheckQuery, [email]);
    if (userCheckResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert new user into the database
    const insertUserQuery = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
    `;
    const values = [username, email, hashedPassword];
    const { rows } = await pool.query(insertUserQuery, values);
    const newUser = rows[0];

    // 5. Respond with success
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user by email
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(userQuery, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },  // Payload
      process.env.JWT_SECRET,             // Secret Key
      { expiresIn: "1d" }                 // Token Validity
    );

    // 5. Respond with success
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
