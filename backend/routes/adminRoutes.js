const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  getAllUsers,
  toggleBlockUser,
  getAllBlogs,
  deleteBlog,
  getDashboard,
} = require("../controllers/adminController");

// Users
router.get("/users", authMiddleware, role("admin"), getAllUsers);
router.patch("/users/:id/block", authMiddleware, role("admin"), toggleBlockUser);

// Blogs
router.get("/blogs", authMiddleware, role("admin"), getAllBlogs);
router.delete("/blogs/:id", authMiddleware, role("admin"), deleteBlog);

// Dashboard
router.get("/dashboard", authMiddleware, role("admin"), getDashboard);

module.exports = router;