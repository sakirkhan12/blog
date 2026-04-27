const express = require('express');
const router = express.Router();
const authMiddleware=require('../middlewares/authMiddleware')

const {
  registerUser,
  loginUser,
  logout
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/logout", logout);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile data, auto login with token verify by backend",
    user: req.user
  });
});

module.exports = router;