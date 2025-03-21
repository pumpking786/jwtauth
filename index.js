const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise"); // Use promise-based MySQL
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");
const app = express();

const SECRET_KEY = "your_secret_key"; // Secret key for signing the JWT

app.use(cookieParser());
app.use(express.json());

// MySQL database connection (async/await)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "jwt_auth",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token
  if (!token) return res.status(401).send("Access denied. No token provided.");

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user; // Store user in request object
    next();
  });
};

// Register a user (only for testing)
// (async () => {
//   try {
//     const username = "sagar123";
//     const plainPassword = "678910";
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [
//       username,
//       hashedPassword,
//     ]);
//     console.log("User inserted successfully!");
//   } catch (err) {
//     console.error("Error inserting user:", err);
//   }
// })();


// POST /signup - User registration (signup)
app.post("/signup", 
    body("username").notEmpty().withMessage("Username is required"), 
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"), 
    async (req, res) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
  
      const { username, password } = req.body;
  
      try {
        // Check if the username already exists in the database
        const [existingUser] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUser.length > 0) {
          return res.status(400).send("Username already taken");
        }
  
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Insert new user into the 'users' table
        await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
  
        res.json({ message: "User registered successfully!" });
      } catch (err) {
        res.status(500).send("Database query error");
      }
    }
  );
  


// POST /login - User login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [results] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0)
      return res.status(400).send("Invalid username or password");

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).send("Invalid username or password");

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).send("Database query error");
  }
});

// GET /getusers - Protected route
app.get("/getusers", authenticateJWT, async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM user_details WHERE user_id=? ", [
      req.user.id,
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
});

// POST /adduser - Add a new user (Protected)
app.post(
  "/adduser",
  authenticateJWT, // Added authentication
  body("email").isEmail(),
  body("name").notEmpty(),
  body("age").isNumeric(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send("Error in validation");

    const { email, name, age } = req.body;

    try {
      await db.execute(
        "INSERT INTO user_details (email, name, age, user_id) VALUES (?, ?, ?, ?)",
        [email, name, age, req.user.id]
      );
      res.json({ message: "User added", addedItem: { email, name, age } });
    } catch (err) {
      res.status(500).send("Error inserting user");
    }
  }
);

// PUT /edit/:name - Edit user details (Protected)
app.put(
  "/edit/:name",
  authenticateJWT, // Added authentication
  body("email").isEmail(),
  body("name").notEmpty(),
  body("age").isNumeric(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send("Error in validation");

    const { email, name, age } = req.body;

    try {
      const [results] = await db.execute(
        "UPDATE user_details SET email = ?, name = ?, age = ? WHERE name = ? AND user_id = ?",
        [email, name, age, req.params.name, req.user.id]
      );

      if (results.affectedRows === 0)
        return res.status(404).send("User not found");
      res.json({ message: `${name} updated`, user: { email, name, age } });
    } catch (err) {
      res.status(500).send("Database query error");
    }
  }
);

// DELETE /deleteuser/:name - Delete a user (Protected)
app.delete("/deleteuser/:name", authenticateJWT, async (req, res) => {
  try {
    const [results] = await db.execute(
      "DELETE FROM user_details WHERE name = ? AND user_id = ?",
      [req.params.name, req.user.id]
    );

    if (results.affectedRows === 0)
      return res.status(404).send("User not found");
    res.send(`${req.params.name} deleted`);
  } catch (err) {
    res.status(500).send("Database query error");
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
