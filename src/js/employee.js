const inquirer = require("inquirer");
const connection = require("../../config/connection");
const cTable = require("console.table");

async function get_employee() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM employee`, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

async function get_role() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM role`, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

async function get_employee_by_manager(manager_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM employee WHERE manager_id = ?`,
      [manager_id],
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

async function get_department_list() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM department`, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

async function get_role_list_by_department(department_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM role WHERE department_id = ${department_id}`,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

async function generate_question(message, list) {
  const new_list = [];
  for (var i = 0; i < list.length; i++) {
    if (message === "What is the employee department? ") {
      var choice = {
        value: list[i].id,
        name: list[i].name,
      };
    } else if (
      message === "What is the employee role? " ||
      message === "Which role do you choose? "
    ) {
      var choice = {
        value: list[i].id,
        name: list[i].title,
      };
    } else if (
      message === "Which employee do you want to remove? " ||
      message === "Choose the manager:" ||
      message === "Which employee do you want to update? " ||
      message === "Who is your manager? "
    ) {
      var choice = {
        value: list[i].id,
        name: list[i].first_name + " " + list[i].last_name,
      };
    }
    new_list.push(choice);
  }
  if (message === "Who is your manager? ") {
    new_list.push({
      value: "NULL",
      name: "NULL",
    });
  }
  const question = {
    type: "list",
    message: message,
    name: "answer",
    choices: new_list,
  };

  const answer = await inquirer.prompt(question);
  return answer.answer;
}

const add_employee_question = [
  {
    type: "input",
    message: "What is your first name? ",
    name: "first",
  },
  {
    type: "input",
    message: "What is your last name? ",
    name: "last",
  },
];

async function update_employee(
  table,
  column,
  update_value,
  where,
  where_value
) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET ${column} = ${update_value} WHERE ${where} = ${where_value}`,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

async function add_employee_helper(first_name, last_name, role_id, manager_id) {
  if (manager_id != "NULL") {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO employee (`first_name`, `last_name`, `role_id`, `manager_id`) VALUES (?,?,?,?)",
        [first_name, last_name, role_id, manager_id],
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO employee (`first_name`, `last_name`, `role_id`) VALUES (?,?,?)",
        [first_name, last_name, role_id],
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        }
      );
    });
  }
}

async function remove_employee_helper(employee_id) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM employee where id = ${employee_id}`),
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      };
  });
}

module.exports = {
  //view all employees
  view_employee: async function view_employee() {
    const employee = await get_employee();
    console.table(employee);
  },
  //View all employees by manager
  view_employee_by_manager: async function view_employee_by_manager() {
    const employee_list = await get_employee();
    const manager_id = await generate_question(
      "Choose the manager:",
      employee_list
    );
    const new_employee_list = await get_employee_by_manager(manager_id);
    console.table(new_employee_list);
  },
  //Add Employee
  add_employee: async function add_employee() {
    const department_list = await get_department_list();
    const department_answer = await generate_question(
      "What is the employee department? ",
      department_list
    );

    const role_list = await get_role_list_by_department(department_answer);

    const role_answer = await generate_question(
      "What is the employee role? ",
      role_list
    );

    const manager = await get_employee();
    const manager_answer = await generate_question(
      "Who is your manager? ",
      manager
    );

    const new_employee = await inquirer.prompt(add_employee_question);
    const add_employee_success = await add_employee_helper(
      new_employee.first,
      new_employee.last,
      role_answer,
      manager_answer
    );
  },
  //remove employee
  remove_employee: async function remove_employee() {
    const employee_list = await get_employee();
    const remove_employee = await generate_question(
      "Which employee do you want to remove? ",
      employee_list
    );
    const remove = remove_employee_helper(remove_employee);
    console.log("sucess");
  },
  update_employee_role: async function update_employee_role() {
    const employee_list = await get_employee();
    const employee_update = await generate_question(
      "Which employee do you want to update? ",
      employee_list
    );

    const role_list = await get_role();
    const role_update = await generate_question(
      "Which role do you choose? ",
      role_list
    );
    const update = update_employee(
      "employee",
      "role_id",
      role_update,
      "id",
      employee_update
    );
  },
  update_employee_manager: async function update_employee_manager() {
    const employee_list = await get_employee();
    const employee_update = await generate_question(
      "Which employee do you want to update? ",
      employee_list
    );

    const manager_list = await get_employee();
    const manager_update = await generate_question(
      "Choose the manager:",
      manager_list
    );
    const update = update_employee(
      "employee",
      "manager_id",
      manager_update,
      "id",
      employee_update
    );
  },
};
