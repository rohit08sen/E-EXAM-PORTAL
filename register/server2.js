const express = require("express");
const mysql2 = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(express.static("public")); // Serve static files like CSS, JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing JSON payloads

// Database connection
const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "Rohit@541", // Update as needed
  database: "registration", // Ensure this DB exists
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database.");
  }
});

// Login endpoint
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const query = "SELECT * FROM users WHERE name = ? AND password = ?";
  db.query(query, [name, password], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }

    if (results.length > 0) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password." });
    }
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
