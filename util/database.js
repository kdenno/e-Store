/*
const {Sequelize} = require("sequelize");
const connection = new Sequelize("node-complete", "root", "Inventions@256", {
    host : "localhost",
  dialect: "mysql"
}); 
*/
// bring mongoDB
const mongoDB = require("mongodb");
const MongoClient = mongoDB.MongoClient;
let _db;
const mongoConnect = cb => {
  MongoClient.connect(
    "mongodb+srv://node-complete:Inventions@256@cluster0-k1a0c.mongodb.net/test?retryWrites=true&w=majority"
  )
    .then(client => {
      _db = client.db();
      cb();
    })
    .catch(err => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No DB to connect to";
};

exports.connect = mongoConnect;
exports.getDb = getDb;
