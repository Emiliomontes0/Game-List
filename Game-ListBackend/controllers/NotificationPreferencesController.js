const NotificationPreferences = require('../models').NotificationPreferences;

exports.getPreferences = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('User ID from request:', userId);
  
      const [results] = await NotificationPreferences.sequelize.query(
        `SELECT * FROM notificationpreferences WHERE user_id = ${userId}`
      );
      
      console.log('Direct Query Result:', results);
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Preferences not found' });
      }
  
      res.json(results[0]);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  

exports.updatePreferences = async (req, res) => {
    try {
      const userId = req.user?.id;
      console.log('User ID from request:', userId);
  
      if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { notify_on_price_drop, discount_threshold, notification_frequency } = req.body;
      if (
        typeof notify_on_price_drop !== 'boolean' ||
        (discount_threshold !== null && typeof discount_threshold !== 'number') ||
        !['weekly', 'monthly', 'every 4 months'].includes(notification_frequency)
      ) {
        return res.status(400).json({
          message:
            'Invalid request data. Notification frequency must be one of: weekly, monthly, every 4 months',
        });
      }

      let preferences = await NotificationPreferences.findOne({
        where: { user_id: userId },
      });
  
      if (!preferences) {
        console.log(`Preferences not found for user ${userId}, creating new preferences.`);
        preferences = await NotificationPreferences.create({
          user_id: userId,
          notify_on_price_drop,
          discount_threshold,
          notification_frequency,
        });
      } else {
        console.log(`Updating preferences for user ${userId}.`);
        await preferences.update({
          notify_on_price_drop,
          discount_threshold,
          notification_frequency,
        });
      }
  
      res.json(preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
