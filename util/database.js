const {Sequelize} = require("sequelize");
const connection = new Sequelize("node-complete", "root", "Inventions@256", {
    host : "localhost",
  dialect: "mysql"
});

module.exports = connection;