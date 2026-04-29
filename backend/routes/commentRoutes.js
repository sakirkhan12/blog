const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  addComment,
  getCommentsByBlog,
} = require("../controllers/commentController");

router.post("/comment", authMiddleware, addComment);
router.get("/:blogId", getCommentsByBlog);

module.exports = router;