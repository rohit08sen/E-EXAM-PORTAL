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

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "Login.html")); // Adjust path as needed
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

// Helper function to send alert and redirect
function sendAlertAndRedirect(res, message, redirectUrl) {
  res.send(`
    <script>
      alert('${message}');
      window.location.href = '${redirectUrl}';
    </script>
  `);
}

// Handle form submission (Registration)
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
        TechnicalSkills,
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

      // Check for duplicate email
      const duplicateQuery = "SELECT * FROM users WHERE email = ?";
      db.query(duplicateQuery, [email], (err, results) => {
        if (err) {
          console.error("Error checking for duplicates:", err);
          return res.status(500).send("An error occurred while registering.");
        }

        if (results.length > 0) {
          return sendAlertAndRedirect(res, "Email is already registered.", "/");
        }

        // SQL query to insert user data into the database (No hashing)
        const query = `
          INSERT INTO users (name, password, email, age, gender, college_address, branch, technical_skills, resume_path, image_path)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          name,
          password, // Store the password as it is
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

          sendAlertAndRedirect(res, "Registration successful!", "http://127.0.0.1:5501/register/Login.html");
        });
      });
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).send("An unexpected error occurred.");
    }
  }
);



// Handle login request (No password hashing)
// Helper function to send alert and redirect to the specified URL
function sendAlertAndRedirect(res, message, redirectUrl) {
  res.send(`
    <script>
      alert('${message}');
      window.location.href = '${redirectUrl}'; // Redirect to the specified URL
    </script>
  `);
}

// Handle login request (No password hashing)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  // Query to find user in the database
  const query = "SELECT * FROM users WHERE name = ?";
  const values = [username];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("An error occurred while logging in.");
    }

    if (results.length > 0) {
      // Directly compare the password without hashing
      if (password === results[0].password) {
        sendAlertAndRedirect(res, "Login successful!", "http://127.0.0.1:5501/register/Login.html");
      } else {
        sendAlertAndRedirect(res, "Invalid username or password.", "http://127.0.0.1:5501/register/Login.html");
      }
    } else {
      sendAlertAndRedirect(res, "Invalid username or password.", "http://127.0.0.1:5501/register/Login.html");
    }
  });
});



// Start server on port 3000
const server1 = app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
