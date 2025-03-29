const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { Blog, User } = require("../models"); // Import from models/index.js

const SECRET_KEY = "your_secret_key"; // Secret key for signing the JWT

// User Signup
exports.signup = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).send("Username already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, username, password: hashedPassword });

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database query error");
    return next();
  }
};

// User Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log("User not found");
      return res.status(400).send("Invalid username or password");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log("Invalid password");
      return res.status(400).send("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    req.session.token = token;

    res.json({ message: "Login Successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Database query error");
  }
};

// User Logout
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.send("Error");
      }
      res.status(400).json({ message: "Logout Successful" });
    });
  } catch (error) {
    res.status(402).json("Error in logout");
  }
};
