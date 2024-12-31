const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  'game_wishlist',       // Database name
  'game_user',           // Database username
  'your_secure_password',// Database password
  {
    host: '127.0.0.1',   // Database host
    dialect: 'postgres', // Database type
  }
);

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
})();
