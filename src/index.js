const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Ensure PostgreSQL pool is correctly set up
const authRoutes = require("./routes/authRoutes");
const landRoutes = require("./routes/landRoutes"); // Ensure correct import
const bidsRoutes = require("./routes/bidRoutes"); // Ensure correct import
const profileRoute = require("./routes/profileRoute"); // Ensure correct import

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "30mb" })); // Ensure URL-encoded request body is processed correctly
app.use(express.json({limit: '30mb'})); // Ensure JSON request body is processed correctly

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", landRoutes); // ✅ This ensures /api/lands works
app.use("/api/bids", bidsRoutes);
app.use("/api/profile", profileRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    const client =await pool.connect();
    console.log("✅ Connected to PostgreSQL Database")
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Database Connection Error:", error)
  }
});
