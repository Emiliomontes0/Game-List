const axios = require('axios');
const { Wishlist, Game, User } = require('../models'); // Include User model
const { sendEmail } = require('../utils/emailService');

const checkPricesAndNotify = async () => {
  try {
    console.log('Starting price check...');

    // Fetch wishlist items with associated game and user
    const wishlistItems = await Wishlist.findAll({
      include: [
        {
          model: Game,
          attributes: ['app_id', 'name', 'price', 'currency', 'discount', 'store_link'],
        },
        {
          model: User,
          attributes: ['email'], // Fetch user email
        },
      ],
    });

    console.log('Wishlist items:', wishlistItems);

    for (const item of wishlistItems) {
      const game = item.Game;
      const user = item.User; // Access user information

      if (!game || !user) {
        console.log(
          `Game or user not found for wishlist item ID: ${item.id}`
        );
        continue;
      }

      console.log(`Fetching price for App ID: ${game.app_id}`);

      const response = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${game.app_id}`
      );
      const data = response.data[game.app_id];

      if (data.success && data.data.price_overview) {
        const currentPrice = data.data.price_overview.final / 100;
        const discount = data.data.price_overview.discount_percent;

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
          const changes = [];
          if (dbPrice === null && currentPrice !== null) {
            changes.push(`Price now available: $${currentPrice}`);
          }
          if (dbPrice !== null && currentPrice < dbPrice) {
            changes.push(`Price dropped: $${dbPrice} -> $${currentPrice}`);
          }
          if (dbDiscount !== null && discount > dbDiscount) {
            changes.push(`Discount increased: ${dbDiscount}% -> ${discount}%`);
          }

          // Send email notification to the user's email
          const userEmail = user.email;
          const emailSubject = `Price Update: ${game.name}`;
          const emailText = `
            Good news for your wishlist!
            ${changes.join('\n')}
            
            Check it out here: ${game.store_link}
          `;

          await sendEmail(userEmail, emailSubject, emailText);
          console.log(
            `Notification sent to user ${user.email} for ${game.name}.`
          );

          // Update the database with new price and discount
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
