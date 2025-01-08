const { Wishlist, Game, Sequelize } = require('../models');

exports.addToWishlist = async (req, res) => {
    const { game_id, platform } = req.body;
    const user_id = req.user.id; 
  
    try {
      const game = await Game.findOne({
        where: { app_id: Number(game_id) }, 
      });      
      if (!game) {
        return res.status(404).json({ message: 'Game not found in the database.' });
      }
      const existingItem = await Wishlist.findOne({
        where: { user_id, game_id, platform },
      });
      if (existingItem) {
        return res.status(400).json({ message: 'Game already in wishlist for this platform.' });
      }
      const wishlistItem = await Wishlist.create({
        user_id,
        game_id,
        platform,
      });
  
      res.status(201).json({ message: 'Game added to wishlist!', wishlistItem });
    } catch (error) {
      console.error('Error adding to wishlist:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

exports.getWishlist = async (req, res) => {
    const user_id = req.user.id;
  
    try {
        const wishlist = await Wishlist.findAll({
            where: { user_id },
            include: [
              {
                model: Game,
                attributes: ['app_id', 'name', 'price', 'currency', 'discount', 'store_link'], // Include specific fields
              },
            ],
          });
                  
  
      res.status(200).json(wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  


exports.removeFromWishlist = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const wishlistItem = await Wishlist.findByPk(id);
      if (!wishlistItem) {
        return res.status(404).json({ message: 'Wishlist item not found.' });
      }
  
      await wishlistItem.destroy();
      res.status(200).json({ message: 'Game removed from wishlist!' });
    } catch (error) {
      console.error('Error removing from wishlist:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
