'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NotificationPreferences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Adjust the table name if needed
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      notify_on_price_drop: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      discount_threshold: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      notification_frequency: {
        type: Sequelize.STRING,
        defaultValue: 'daily',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NotificationPreferences');
  },
};
