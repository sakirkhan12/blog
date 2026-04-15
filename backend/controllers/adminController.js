const User = require("../models/userModel");
const Blog = require("../models/blogModel");

// GET USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// BLOCK / UNBLOCK USER
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// GET BLOGS (FIXED POPULATE)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "name email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error in blogs" });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
};

// DASHBOARD
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    res.json({
      totalUsers,
      totalBlogs,
      blockedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};