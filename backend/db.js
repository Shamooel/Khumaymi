const mysql = require("mysql2");

// Create a connection to MySQL
const connection = mysql.createConnection({
    host: "localhost",   // Change if using a remote server
    user: "root",        // Your MySQL username
    password: "",        // Your MySQL password
    database: "clothes", // Replace with your actual database name
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL Database!");
});

module.exports = connection;
