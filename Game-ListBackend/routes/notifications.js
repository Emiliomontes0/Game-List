const express = require('express');
const router = express.Router();
const {
  getPreferences,
  updatePreferences,
} = require('../controllers/NotificationPreferencesController');
const authenticateToken = require('../middleware/authMiddleware'); // Middleware for authentication

// Routes
router.get('/preferences', authenticateToken, getPreferences); // Get preferences
router.put('/preferences', authenticateToken, updatePreferences); // Update preferences

module.exports = router;
