const express = require("express");
const mysql2 = require("mysql2");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(express.static("public")); // For serving static files like CSS, JS
app.use(express.static("register")); // To serve files from the 'register' folder
app.use(bodyParser.urlencoded({ extended: true }));

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

// Serve the HTML form at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Adjust path as needed
});

// Check DB Connection Route
app.get("/check-db-connection", (req, res) => {
  db.ping((err) => {
    if (err) {
      console.error("Database connection failed:", err);
      return res.status(500).json({ connected: false });
    }
    res.json({ connected: true });
  });
});

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
ensureDirectoryExists("uploads/resumes");
ensureDirectoryExists("uploads/images");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume") {
      cb(null, "uploads/resumes");
    } else if (file.fieldname === "image") {
      cb(null, "uploads/images");
    } else {
      cb(new Error("Invalid file field"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Handle form submission
app.post(
  "/submit-registration",
  upload.fields([{ name: "resume" }, { name: "image" }]),
  (req, res) => {
    try {
      const {
        name,
        password,
        email,
        age,
        gender,
        college_address,
        branch,
        TechnicalSkills, // Fixed variable name
      } = req.body;

      const resumePath =
        req.files && req.files.resume && req.files.resume[0]
          ? req.files.resume[0].path
          : null;
      const imagePath =
        req.files && req.files.image && req.files.image[0]
          ? req.files.image[0].path
          : null;

      const technicalSkills = Array.isArray(TechnicalSkills)
        ? TechnicalSkills.join(", ")
        : TechnicalSkills;

      // Ensure required fields are present
      if (!name || !password || !email) {
        return res.status(400).send("Name, password, and email are required.");
      }

      // SQL query to insert user data into the database
      const query = `
        INSERT INTO users (name, password, email, age, gender, college_address, branch, technical_skills, resume_path, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        name,
        password,
        email,
        age,
        gender,
        college_address,
        branch,
        technicalSkills,
        resumePath,
        imagePath,
      ];

      // Execute SQL query
      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).send("An error occurred while registering.");
        }

        // Send a success HTML response
        res.send(`
         
            <script>
              
                alert('Registration successful!');
              
            </script>
          
        `);
      });
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).send("An unexpected error occurred.");
    }
  }
);


// Start server on port 3000
const server1 = app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
