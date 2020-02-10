const Sequelize = require("sequelize");
const connection = new Sequelize("node-complete", "root", "Inventions@256", {
  dialect: "mysql",
  host: "localhost"
});
module.exports = connection;