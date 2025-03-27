const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./config/db");
const User = require("./models/User");
const Blog = require("./models/Blog");
const mysql = require("mysql2/promise"); // Use promise-based MySQL
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const { where } = require("sequelize");
const app = express();

const SECRET_KEY = "your_secret_key"; // Secret key for signing the JWT

app.use(cors());
app.use(express.json());

// async function CreateTable() {
//   try {
//     // Drop the User table
//     await db.sync();
//     console.log("Db Table created!");
//   } catch (err) {
//     console.log("Error dropping User table", err.message);
//   }
// }

// // Call the function for the table
// CreateTable();

//Session
app.use(
  session({
    secret: "your-session-secret", // Secret for signing session IDs
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // In production, you should set this to true with HTTPS
  })
);

// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  try {
    const token = req.session.token;
    if (!token)
      return res.status(401).send("Access denied. No token provided.");

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).send("Invalid token.");
      req.user = user; // Store user in request object
      next();
    });
  } catch (err) {
    res.status(402).send("Error");
  }
};

// POST /signup - User registration (signup)
app.post(
  "/signup",
  body("email").isEmail().withMessage("Please use a valid email"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, username, password } = req.body;

    try {
      // Check if the username already exists using Sequelize
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).send("Username already taken");
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the 'users' table using Sequelize
      await User.create({ email, username, password: hashedPassword });

      res.json({ message: "User registered successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Database query error");
      return next();
    }
  }
);

//LOGIN

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Use Sequelize to find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log("User not found");
      return res.status(400).send("Invalid username or password");
    }

    console.log("User found:", user);

    // Compare the provided password with the hashed password in the database
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log("Invalid password");
      return res.status(400).send("Invalid username or password");
    }

    console.log("Password valid, generating token");

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Store the token in the session (if using session-based auth)
    req.session.token = token;

    res.json({ message: "Login Successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Database query error");
  }
});

//LOGOUT

app.post("/logout", authenticateJWT, async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.send("Error ");
      }
      res.status(400).json({ message: "Logout Successful" });
    });
  } catch (error) {
    res.status(402).json("Error in logout");
  }
});

// GET /getusers - Protected route
app.get("/blogs", authenticateJWT, async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (err) {
    res.status(500).send("Database query error");
  }
});

// POST /adduser - Add a new user (Protected)
app.post(
  "/addblog",
  authenticateJWT, // Added authentication middleware
  body("title").notEmpty().withMessage("Title is required"), // Using 'title' instead of 'topic'
  body("description").notEmpty().withMessage("Description is required"),
  async (req, res) => {
    try {
      // Validate the input data
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const { title, description } = req.body;

      try {
        // Create a new blog post using Sequelize ORM
        await Blog.create({
          title: title,
          description: description,
          user_id: req.user.id, // Get the user ID from the authenticated JWT
        });

        // Send a success response
        res.json({
          message: "Blog added successfully",
          addedItem: { title, description },
        });
      } catch (err) {
        console.error("Error inserting blog:", err);
        res.status(500).send("Error inserting Blog");
      }
    } catch (err) {
      console.error("Error in adding blog:", err);
      res.status(402).json("Error in adding blog");
    }
  }
);

// PUT /edit/:name - Edit user details (Protected)
app.put(
  "/editblog/:id",
  authenticateJWT, // Added authentication middleware
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  async (req, res) => {
    try {
      // Validate request body
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const { title, description } = req.body;
      const blogId = req.params.id;

      // Find the blog post
      const blog = await Blog.findOne({
        where: { id: blogId, user_id: req.user.id }, // Ensure user owns the blog
      });

      if (!blog) {
        return res
          .status(404)
          .json({ message: "Blog not found or unauthorized" });
      }

      // Update the blog post
      await blog.update({ title, description });

      res.json({ message: `Blog ${blogId} updated successfully`, blog });
    } catch (err) {
      console.error("Error updating blog:", err);
      res.status(500).send("Error updating Blog");
    }
  }
);

// DELETE /deleteuser/:name - Delete a user (Protected)
app.delete("/deleteblog/:id", authenticateJWT, async (req, res) => {
  try {
    const blogId = req.params.id;

    // Find the blog post that belongs to the authenticated user
    const blog = await Blog.findOne({
      where: { id: blogId, user_id: req.user.id },
    });

    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found or unauthorized" });
    }

    // Delete the blog post
    await blog.destroy(); // FIXED: Using Sequelize's destroy() method

    res.json({ message: `Blog ${blogId} deleted successfully`, blog });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).send("Database query error");
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
