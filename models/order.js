const sequelize = require('sequelize');
const connection = require('../util/database');
// create cart model
const Order = connection.define('order', {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  }
});
module.exports = Order;