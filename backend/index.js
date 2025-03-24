const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import the database connection

const app = express();
app.use(express.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Fetch Users from Database (Example)
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
