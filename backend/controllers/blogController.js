const Blog = require("../models/blogModel");
const Like = require("../models/likeModel");
const { sendCongratulationsMail } = require("../utils/sendEmail");

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.create({
      title,
      content,
      image: req.file ? req.file.filename : null,
      user: req.user.id,
      isPublished: false,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 6 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      blogs,
      totalPages,
      currentPage: page,
      totalBlogs,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

// GET PUBLISHED BLOGS (HOME)
exports.getPublishedBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 6 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ isPublished: true })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments({ isPublished: true });
    const totalPages = Math.ceil(totalBlogs / limit);

    // 🔥 ADD isLiked
    const userId = req.user?.id;

    const updatedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        let isLiked = false;

        if (userId) {
          const liked = await Like.findOne({
            user: userId,
            blog: blog._id,
          });
          isLiked = !!liked;
        }

        return {
          ...blog.toObject(),
          isLiked,
        };
      })
    );

    res.json({
      blogs: updatedBlogs,
      totalPages,
      currentPage: page,
      totalBlogs,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

// MY BLOGS
exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my blogs" });
  }
};

// PUBLISH BLOG
exports.publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    ).populate("user");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    try {
      await sendCongratulationsMail(
        blog.user.email,
        blog.user.name,
        blog.title
      );
    } catch (emailError) {
      console.log("Email error:", emailError.message);
    }

    res.json({ message: "Blog published & email sent", blog });
  } catch (err) {
    res.status(500).json({ message: "Error publishing blog" });
  }
};

// GET SINGLE BLOG
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "user",
      "name"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog" });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    if (req.file) {
      blog.image = req.file.filename;
    }

    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error updating blog" });
  }
};