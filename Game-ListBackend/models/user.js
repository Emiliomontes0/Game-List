'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
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
      notification_preference: {
        type: DataTypes.JSON,
        defaultValue: [],
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
      tableName: 'Users', 
      timestamps: true,  
      underscored: false, 
    }
  );
  return User;
};
