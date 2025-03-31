const express = require("express");
const { body } = require("express-validator");
const blogController = require("../controllers/BlogController");
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

// Get all blogs
router.get("/", authenticateJWT, blogController.getBlogs);

// Add a blog
router.post(
  "/add",
  [
    authenticateJWT,
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  blogController.addBlog
);

// Edit a blog
router.put(
  "/edit/:id",
  [
    authenticateJWT,
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  blogController.editBlog
);

// Delete a blog
router.delete("/delete/:id", authenticateJWT, blogController.deleteBlog);

module.exports = router;
