'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_image: DataTypes.STRING,
      notification_preferences: { // Updated column name
        type: DataTypes.JSON,
        defaultValue: {}, // Default to an empty object
      },
      wishlist: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      last_login: DataTypes.DATE,
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reset_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users', // Explicitly match the database table name
      timestamps: true, // Enable createdAt and updatedAt
      underscored: false, // Keep camelCase column names
    }
  );
  return User;
};
