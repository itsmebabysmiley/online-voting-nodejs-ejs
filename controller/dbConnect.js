const mysql = require("promise-mysql");

var dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
module.exports = async () => {
  try {
    let pool = await mysql.createPool(dbConfig);
    let connection = pool.getConnection();
    console.log(`Database ${process.env.DB_NAME} connected!`)
    return connection;
  } catch (error) {
    throw error;
  }
};