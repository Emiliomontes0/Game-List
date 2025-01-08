const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/add', authenticateToken, addToWishlist);     
router.get('/', authenticateToken, getWishlist);          
router.delete('/:id', authenticateToken, removeFromWishlist); 

module.exports = router;
