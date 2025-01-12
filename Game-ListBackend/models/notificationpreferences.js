'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotificationPreferences extends Model {
    static associate(models) {
      NotificationPreferences.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  NotificationPreferences.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notify_on_price_drop: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      discount_threshold: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notification_frequency: {
        type: DataTypes.STRING,
        defaultValue: 'daily',
      },
    },
    {
      sequelize,
      modelName: 'NotificationPreferences',
      tableName: 'notificationpreferences', // Use lowercase table name
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return NotificationPreferences;
};
