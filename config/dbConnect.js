// const mysql = require("promise-mysql");
var mysql = require('mysql');
var dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
module.exports = async () => {
  try {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();
    return connection;
  } catch (error) {
    throw error;
  }
};