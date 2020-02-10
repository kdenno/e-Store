const Sequelize = require('sequelize');
const connection = require('../util/database');

// create product model/table 
const Product = connection.define('product', {
    id:{
    type: Sequelize.INTEGER,
    allowNull: null,
    primaryKey: true,
    autoIncrement: true
},
title: Sequelize.STRING,
price: {
    type: Sequelize.INTEGER,
    allowNull: false
},
imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
},
description: {
    type: Sequelize.TEXT,
    allowNull: false
}

});
module.exports = Product;