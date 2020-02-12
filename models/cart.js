const sequelize = require('sequelize');
const connection = require('../util/database');
// create cart model
const Cart = connection.define('cart', {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  }
});
module.exports = Cart;