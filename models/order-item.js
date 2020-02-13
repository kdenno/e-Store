const sequelize = require('sequelize');
const connection = require('../util/database');

const OrderItem = connection.define('orderItem', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }
});
module.exports = OrderItem;