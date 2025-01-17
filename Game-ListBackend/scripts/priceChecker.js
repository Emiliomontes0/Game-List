const axios = require('axios');
const { Wishlist, Game, User, NotificationLog } = require('../models'); // Include NotificationLog model
const { sendEmail } = require('../utils/emailService');
console.log('Price checker script started...');

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
          attributes: ['email', 'notification_preferences'], // Fetch user email and preferences
        },
      ],
    });

    console.log(`Total wishlist items fetched: ${wishlistItems.length}`);

    const userNotifications = {}; // Group notifications by user

    for (const item of wishlistItems) {
      const game = item.Game;
      const user = item.User; // Access user information

      if (!game || !user) {
        console.log(`Game or user not found for wishlist item ID: ${item.id}`);
        continue;
      }

      const preferences = user.notification_preferences || {};
      const notifyPriceDrop = preferences.notify_price_drop ?? true;
      const notifyThreshold = preferences.notify_discount_threshold ?? 0;

      if (!notifyPriceDrop) {
        console.log(`User ${user.email} disabled price drop notifications.`);
        continue;
      }

      console.log(`Fetching price for App ID: ${game.app_id}`);

      const response = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${game.app_id}`
      );
      const data = response.data[game.app_id];

      if (data.success && data.data.price_overview) {
        const currentPrice = 0.99; // API Price
        const discount = 80; // API Discount
        // const currentPrice = data.data.price_overview.final / 100;
        // const discount = data.data.price_overview.discount_percent;

        const dbPrice = game.price;
        const dbDiscount = game.discount;

        const alreadyNotified = await NotificationLog.findOne({
          where: {
            user_id: item.user_id,
            game_id: game.app_id,
            email_sent: true,
          },
          order: [['createdAt', 'DESC']], // Get the latest notification
        });

        const significantChange =
          (dbPrice !== null && currentPrice < dbPrice) ||
          (dbDiscount !== null && discount > dbDiscount && discount >= notifyThreshold);

        const alreadyNotifiedForCurrentChange =
          alreadyNotified &&
          alreadyNotified.message.includes(`Price dropped: $${dbPrice} -> $${currentPrice}`) &&
          alreadyNotified.message.includes(`Discount increased: ${dbDiscount}% -> ${discount}%`);

        if (significantChange && !alreadyNotifiedForCurrentChange) {
          const changes = [];
          if (dbPrice !== null && currentPrice < dbPrice) {
            changes.push(`Price dropped: $${dbPrice} -> $${currentPrice}`);
          }
          if (dbDiscount !== null && discount > dbDiscount && discount >= notifyThreshold) {
            changes.push(`Discount increased: ${dbDiscount}% -> ${discount}%`);
          }

          // Group changes by user email
          if (!userNotifications[user.email]) {
            userNotifications[user.email] = [];
          }

          userNotifications[user.email].push({
            gameName: game.name,
            changes: changes.join(', '),
            storeLink: game.store_link,
          });

          // Update the database for this game
          await Game.update(
            { price: currentPrice, discount: discount },
            { where: { app_id: game.app_id } }
          );
        } else {
          console.log(`No significant changes for ${game.name}.`);
        }
      } else {
        console.log(`No data found for App ID: ${game.app_id}`);
      }

      // Add a delay to avoid hitting API rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Send bulk emails
    for (const [email, notifications] of Object.entries(userNotifications)) {
      const emailBody = notifications
        .map(
          (n) => `- ${n.gameName}: ${n.changes}\n  Link: ${n.storeLink}`
        )
        .join('\n\n');

      const emailSubject = 'Your Wishlist Discounts Are Here!';
      await sendEmail(email, emailSubject, emailBody);

      console.log(`Notification sent to ${email} with ${notifications.length} items.`);

      // Log notifications in the database
      for (const notification of notifications) {
        const game = await Game.findOne({ where: { name: notification.gameName } });
        await NotificationLog.create({
          user_id: wishlistItems.find((item) => item.Game.name === notification.gameName).user_id,
          game_id: game.app_id,
          email_sent: true,
          message: notification.changes,
        });
      }
    }

    console.log('Price check completed.');
  } catch (error) {
    console.error('Error checking prices:', error.message);
  }
};
module.exports = checkPricesAndNotify;

// Execute the function
checkPricesAndNotify();
