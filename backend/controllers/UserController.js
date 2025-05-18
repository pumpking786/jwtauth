const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { Blog, User } = require("../models"); // Import from models/index.js

const SECRET_KEY = "your_secret_key"; // Secret key for signing the JWT

// User Signup
exports.signup = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next({ message: "Validation errors", statusCode: 400 });
  }

  const { email, username, password, age } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return next({ message: "Username already taken", statusCode: 400 });
    }

    if (username === password) {
      return next({ message: "Username and password can't be the same", statusCode: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, username, password: hashedPassword, age });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    next({ message: "Database query error", statusCode: 500 });
  }
};


// User Login
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return next({ message: "Invalid username or password", statusCode: 400 }); // Pass error to next
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return next({ message: "Invalid username or password", statusCode: 400 }); // Pass error to next
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    req.session.token = token;

    res.json({ message: "Login Successful", token });
  } catch (err) {
    next({ message: "Error during login", statusCode: 500 }); // Pass error to next
  }
};

// User Logout
exports.logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next({ message: "Error during logout", statusCode: 500 }); // Pass error to next
      }
      res.status(200).json({ message: "Logout Successful" });
    });
  } catch (error) {
    next({ message: "Error during logout", statusCode: 500 }); // Pass error to next
  }
};
