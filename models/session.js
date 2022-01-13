const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var config = {
	host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

var sessionStore = new MySQLStore(config);

module.exports = sessionStore;