const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Hoang2121!",
  database: "employee_tracker",
});

module.exports = connection;
