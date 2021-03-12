const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});
//add departments, roles, employees
//view departments, roles, employees
//update employee roles
