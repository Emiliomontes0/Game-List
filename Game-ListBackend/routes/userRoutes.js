const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example protected route
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted!', user: req.user });
});

module.exports = router;
