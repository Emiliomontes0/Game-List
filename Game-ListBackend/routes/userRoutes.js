const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateNotificationPreferences, // Import the new controller
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Route to update notification preferences
router.put('/notifications', authenticateToken, updateNotificationPreferences);

module.exports = router;
