const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = require("../../config/connection");

const employee = require("./employee");
const role = require("./role");
const department = require("./department");

const main_questions = {
  type: "list",
  message: "What would you like to do? ",
  name: "choices",
  choices: [
    "Add Employee",
    "Add Department",
    "Add Roles",
    "View All Employees",
    "View All Employees By Department",
    "View All Employees By Manager",
    "View All Roles",
    "View All Department",
    "Update Employee Roles",
    "Update Employee Manager",
    "Remove Employee",
    "Remove Role",
    "Remove Department",
    "Exit",
  ],
};

module.exports = {
  ask_questions: async function ask_questions() {
    const answer = await inquirer.prompt(main_questions);

    switch (answer.choices) {
      case "Add Employee":
        await employee.add_employee();
        break;
      case "Add Department":
        await department.add_department();
        break;
      case "Add Roles":
        await role.add_role();
        break;
      case "View All Employees":
        await employee.view_employee();
        break;
      case "View All Employees By Department":
        await department.view_employee_by_department();
        break;
      case "View All Employees By Manager":
        await employee.view_employee_by_manager();
        break;
      case "View All Roles":
        await role.view_role();
        break;
      case "View All Department":
        await department.view_department();
        break;
      case "Update Employee Roles":
        await employee.update_employee_role();
        break;
      case "Update Employee Manager":
        await employee.update_employee_manager();
        break;
      case "Remove Employee":
        employee.remove_employee();
        //unfinish
        break;
      case "Remove Role":
        break;
      case "Remove Department":
        break;
    }
    if (answer.choices != "Exit") {
      ask_questions();
    } else {
      connection.end();
    }
  },
};
