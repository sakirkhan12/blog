const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
  getPublishedBlogs,
  publishBlog  
} = require("../controllers/blogController");


// Create Blog (Draft)
router.post("/createblog", authMiddleware, upload.single("image"), createBlog);

//  All Blogs (Admin / testing)
router.get("/", getAllBlogs);

//  Home Page (Only Published)
router.get("/publishblog", getPublishedBlogs);

//  My Blogs
router.get("/myblogs", authMiddleware, getMyBlogs);

// Publish Blog ( IMPORTANT ADD)
router.put("/publish/:id", authMiddleware, publishBlog);

//  Single Blog
router.get("/:id", getBlogById);

//  Delete
router.delete("/:id", authMiddleware, deleteBlog);

//  Update
router.put("/:id", authMiddleware, upload.single("image"), updateBlog);

module.exports = router;