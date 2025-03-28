const Blog = require("../models/Blog");
const { validationResult } = require("express-validator");

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

// Add a new blog
exports.addBlog = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { title, description } = req.body;
    await Blog.create({ title, description, user_id: req.user.id });

    res.json({
      message: "Blog added successfully",
      addedItem: { title, description },
    });
  } catch (err) {
    console.error("Error in adding blog:", err);
    res.status(500).json("Error in adding blog");
  }
};

// Edit a blog
exports.editBlog = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { title, description } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findOne({
      where: { id: blogId, user_id: req.user.id },
    });
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found or unauthorized" });
    }

    await blog.update({ title, description });
    res.json({ message: `Blog ${blogId} updated successfully`, blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).send("Error updating Blog");
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findOne({
      where: { id: blogId, user_id: req.user.id },
    });
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found or unauthorized" });
    }

    await blog.destroy();
    res.json({ message: `Blog ${blogId} deleted successfully`, blog });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).send("Database query error");
  }
};
