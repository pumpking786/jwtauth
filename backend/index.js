const express = require("express");
const cors = require("cors");

const { body, validationResult } = require("express-validator");
const blogController = require("./controllers/BlogController");
const userController = require("./controllers/UserController");
const authenticateJWT = require("./middleware/authenticateJWT");
const sessionMiddleware = require("./middleware/session");
const app = express();

app.use(cors());
app.use(express.json());

app.use(sessionMiddleware()); // Apply session middleware here

// User Routes
app.post(
  "/signup",
  body("email").isEmail().withMessage("Please use a valid email"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  userController.signup
);

app.post("/login", userController.login);
app.post("/logout", authenticateJWT, userController.logout);

// Blog routes
app.get("/blogs", authenticateJWT, blogController.getBlogs);
app.post(
  "/addblog",
  authenticateJWT,
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  blogController.addBlog
);
app.put(
  "/editblog/:id",
  authenticateJWT,
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  blogController.editBlog
);
app.delete("/deleteblog/:id", authenticateJWT, blogController.deleteBlog);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
