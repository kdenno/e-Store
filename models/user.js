const sequelize = require("sequelize");
const connection = require("../util/database");

const User = connection.define({
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  email: sequelize.STRING,
  name: {
    type: sequelize.STRING
  }
});

module.exports = User;
