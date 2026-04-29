const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { toggleLike, getLikesByBlog } = require("../controllers/likeController");

router.post("/like", authMiddleware, toggleLike);


router.get("/:blogId", getLikesByBlog);

module.exports = router;