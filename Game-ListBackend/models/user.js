'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Associations can be defined here if needed later.
     */
    static associate(models) {
      // Example association if needed later:
      // User.hasMany(models.Wishlist, { foreignKey: 'user_id' });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Ensures email format is valid
        },
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
      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notification_preference: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      wishlist: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users', // Explicitly set table name
      underscored: true,  // Use snake_case in DB
      timestamps: true,   // Enable default timestamps: createdAt and updatedAt
    }
  );
  return User;
};
