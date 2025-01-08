'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      Game.hasMany(models.Wishlist, { foreignKey: 'game_id', sourceKey: 'app_id' });
    }
  }
  Game.init(
    {
      app_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, 
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true, 
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD', 
      },
      discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0, 
      },
      store_link: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
    },
    {
      sequelize,
      modelName: 'Game',
      tableName: 'games', 
      timestamps: true, 
      underscored: true, 
    }
  );
  return Game;
};
