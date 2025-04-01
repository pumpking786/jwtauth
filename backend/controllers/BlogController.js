const { Blog, User } = require("../models"); // Import from models/index.js
const { validationResult } = require("express-validator");

// Get all blogs
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (err) {
    next({ message: "Error fetching blogs", statusCode: 500 }); // Pass error to next middleware
  }
};

// Add a new blog
exports.addBlog = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { title, description, writer } = req.body;
    await Blog.create({ title, description, writer, user_id: req.user.id });

    res.json({
      message: "Blog added successfully",
      addedItem: { title, description, writer },
    });
  } catch (err) {
    console.error("Error in adding blog:", err);
    next({ message: "Error in adding blog", statusCode: 500 }); // Pass error to next middleware
  }
};

// Edit a blog
exports.editBlog = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { title, description, writer } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findOne({
      where: { id: blogId, user_id: req.user.id },
    });
    if (!blog) {
      return next({ message: "Blog not found or unauthorized", statusCode: 404 }); // Pass error to next middleware
    }

    await blog.update({ title, description, writer });
    res.json({ message: `Blog ${blogId} updated successfully`, blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    next({ message: "Error updating blog", statusCode: 500 }); // Pass error to next middleware
  }
};

// Delete a blog
exports.deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findOne({
      where: { id: blogId, user_id: req.user.id },
    });
    if (!blog) {
      return next({ message: "Blog not found or unauthorized", statusCode: 404 }); // Pass error to next middleware
    }

    await blog.destroy();
    res.json({ message: `Blog ${blogId} deleted successfully`, blog });
  } catch (err) {
    console.error("Error deleting blog:", err);
    next({ message: "Error deleting blog", statusCode: 500 }); // Pass error to next middleware
  }
};
