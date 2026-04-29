const Like = require("../models/likeModel");
const Blog = require("../models/blogModel");

exports.toggleLike = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.id;

    const existing = await Like.findOne({
      user: userId,
      blog: blogId,
    });

    //  UNLIKE
    if (existing) {
      await existing.deleteOne();

      await Blog.findByIdAndUpdate(blogId, {
        $inc: { likesCount: -1 },
      });

      return res.json({ liked: false });
    }

    // LIKE
    await Like.create({
      user: userId,
      blog: blogId,
    });

    await Blog.findByIdAndUpdate(blogId, {
      $inc: { likesCount: 1 },
    });

    res.json({ liked: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.getLikesByBlog = async (req, res) => {
  try {
    const likes = await Like.find({ blog: req.params.blogId })
      .populate("user", "name");

    res.json(likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};