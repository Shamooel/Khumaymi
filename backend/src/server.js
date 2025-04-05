const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db"); // Database connection import

const app = express();
app.use(express.json());
app.use(cors());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, this is the backend server!");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
