const axios = require('axios');
const { Wishlist, Game } = require('../models');
const { sendEmail } = require('../utils/emailService'); 

const checkPricesAndNotify = async () => {
  try {
    console.log('Starting price check...');

    const wishlistItems = await Wishlist.findAll({
      include: [
        {
          model: Game,
          attributes: ['app_id', 'name', 'price', 'currency', 'discount', 'store_link'],
        },
      ],
    });

    console.log('Wishlist items:', wishlistItems);

    for (const item of wishlistItems) {
      const game = item.Game;

      if (!game) {
        console.log(`Game not found for wishlist item ID: ${item.id}`);
        continue;
      }

      console.log(`Fetching price for App ID: ${game.app_id}`);

      const response = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${game.app_id}`
      );
      const data = response.data[game.app_id];

      if (data.success && data.data.price_overview) {
        // Simulate a price drop for testing
        const currentPrice = 3.99; // Replace with a simulated lower price
        const discount = 20;       // Replace with a simulated discount percentage

        //const currentPrice = data.data.price_overview.final / 100;
        //const discount = data.data.price_overview.discount_percent;

        console.log(
          `Current price for ${game.name}: $${currentPrice} (Discount: ${discount}%)`
        );

        const dbPrice = game.price;
        const dbDiscount = game.discount;

        console.log(`DB Price: ${dbPrice}, DB Discount: ${dbDiscount}`);
        console.log(`API Price: ${currentPrice}, API Discount: ${discount}`);

        if (
          (dbPrice === null && currentPrice !== null) || 
          (dbPrice !== null && currentPrice < dbPrice) ||
          (dbDiscount !== null && discount > dbDiscount)
        ) {
          if (dbPrice === null && currentPrice !== null) {
            console.log(`Previously no price, now available for ${game.name}.`);
          }
          if (dbPrice !== null && currentPrice < dbPrice) {
            console.log(`Price dropped for ${game.name}: ${dbPrice} -> ${currentPrice}`);
          }
          if (dbDiscount !== null && discount > dbDiscount) {
            console.log(
              `Discount increased for ${game.name}: ${dbDiscount}% -> ${discount}%`
            );
          }

          const userEmail = process.env.EMAIL_USER; 
          const emailSubject = `Price Drop Alert: ${game.name}`;
          const emailText = `
            Great news!
            
            The game "${game.name}" is now available for $${currentPrice} (${discount}% off).
            You can check it out here: ${game.store_link}

            Happy gaming!
          `;

          await sendEmail(userEmail, emailSubject, emailText);
          console.log(`Notification sent to user ${item.user_id} for ${game.name}.`);

          await Game.update(
            {
              price: currentPrice,
              discount: discount,
            },
            {
              where: { app_id: game.app_id },
            }
          );

          console.log(
            `Updated ${game.name} in the database with new price and discount.`
          );

        } else {
          console.log(`No significant changes for ${game.name}.`);
        }
      } else {
        console.log(`No data found for App ID: ${game.app_id}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    console.log('Price check completed.');
  } catch (error) {
    console.error('Error checking prices:', error.message);
  }
};

module.exports = checkPricesAndNotify;
