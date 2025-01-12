'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationLog extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  NotificationLog.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      message: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'NotificationLog',
      tableName: 'NotificationLogs',
      timestamps: false, // Enable Sequelize timestamps
      underscored: true, // Use snake_case column names
    }
  );  
  return NotificationLog;
};
