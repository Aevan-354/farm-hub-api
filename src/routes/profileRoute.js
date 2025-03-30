const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");

// ✅ USER Profile
router.get("/:id", async (req, res) => {
  try {
    const userId =req.params.id
    const userFound = await pool.query("SELECT id, username, email, profile_image, created_at FROM users WHERE id = $1 LIMIT 1", [userId]);
    if (!userFound.rows.length) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(201).json(userFound.rows[0]);
  } catch ({message}) {
    res.status(500).json({ message });
  }
});

// UPDATE User profile
router.put("/:id", async (req, res) => {
  try {
    const userId =req.params.id
    const { profile_image, currentPassword, newPassword } = req.body;
    const userFound = (await pool.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [userId])).rows.at(0);
    if (!userFound) {
        return res.status(404).json({ message: "User profile not found" });
    }

    if(currentPassword && newPassword){
        const isMatch = await bcrypt.compare(currentPassword, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Passsword" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId])
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

module.exports = router;
