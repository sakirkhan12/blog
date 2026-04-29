const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");

exports.addComment = async (req, res) => {
  try {
    const { text, blogId } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment required" });
    }

    await Comment.create({
      text,
      user: req.user.id,
      blog: blogId,
    });

    // count update
    await Blog.findByIdAndUpdate(blogId, {
      $inc: { commentsCount: 1 },
    });

    res.json({ message: "Comment added" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};