const sequelize = require('sequelize');
const connection = require('../util/database');

const CartItem = connection.define('cartItem', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: sequelize.INTEGER
});
module.exports = CartItem;