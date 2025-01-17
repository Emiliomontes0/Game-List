const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  registerUser,
  loginUser,
  updateNotificationPreferences, 
} = require('../controllers/userController');

const authenticateToken = require('../middleware/authMiddleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

// Routes
router.post('/register', registerLimiter, registerUser);
router.post('/login', loginLimiter, loginUser);

// Route to update notification preferences
router.put('/notifications', authenticateToken, updateNotificationPreferences);

module.exports = router;
