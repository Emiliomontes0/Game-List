const axios = require('axios');
const { Wishlist, User } = require('../models');

const fetchSteamPrice = async (appId) => {
    console.log(`Fetching price for App ID: ${appId}`); 
    try {
      const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
      const gameData = response.data[appId];
  
      if (gameData.success) {
        const priceOverview = gameData.data.price_overview;
        console.log(`Price fetched for ${gameData.data.name}:`, priceOverview); 
        if (priceOverview) {
          return {
            name: gameData.data.name,
            price: priceOverview.final / 100,
            original_price: priceOverview.initial / 100,
            discount: priceOverview.discount_percent,
            currency: priceOverview.currency,
            store_link: `https://store.steampowered.com/app/${appId}`,
          };
        }
      } else {
        console.log(`No data found for App ID: ${appId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching price for App ID ${appId}:`, error.message);
      return null;
    }
  };
  
  const checkPricesAndNotify = async () => {
    console.log('Starting price check...'); 
    try {
      const wishlists = await Wishlist.findAll({ where: { notify_discount: true } });
      console.log('Wishlist items:', wishlists); 
  
      for (const item of wishlists) {
        const priceInfo = await fetchSteamPrice(item.game_id);
  
        if (priceInfo && priceInfo.discount > 0) {
          console.log(
            `Notification: ${priceInfo.name} is now $${priceInfo.price} (${priceInfo.discount}% off) on Steam. Link: ${priceInfo.store_link}`
          );
        } else {
          console.log(`No discounts for ${item.game_name} (${item.game_id}).`);
        }
      }
    } catch (error) {
      console.error('Error checking prices:', error.message);
    }
  };
  
module.exports = { checkPricesAndNotify };
