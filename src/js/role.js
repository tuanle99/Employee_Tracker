const connection = require("../../config/connection");
const inquirer = require("inquirer");

async function view_role() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM role`, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
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

async function generate_question(list) {
  const new_list = [];
  for (var i = 0; i < list.length; i++) {
    new_list.push(list[i].name);
  }
  const question = {
    type: "list",
    message: "Which department do you choose?",
    name: "answer",
    choices: new_list,
  };

  const answer = await inquirer.prompt(question);
  return answer.answer;
}

async function get_query(table, data, value) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} WHERE ${data} = ?`,
      [value],
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

const add_role_questions = [
  {
    type: "input",
    message: "What is the role name? ",
    name: "name",
  },
  {
    type: "input",
    message: "What is the role salary? ",
    name: "salary",
  },
];

async function add_role_helper(title, salary, department_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO role (`title`, `salary`, `department_id`) VALUES(?,?,?)",
      [title, salary, department_id],
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

module.exports = {
  view_role: async function () {
    console.clear();
    const role = await view_role();
    console.table(role);
  },
  add_role: async function add_role() {
    console.clear();
    const department_list = await get_department_list();
    const department_name = await generate_question(department_list);
    const department_id = await get_query(
      "department",
      "name",
      department_name
    );
    const role_add = await inquirer.prompt(add_role_questions);

    const added = await add_role_helper(
      role_add.name,
      role_add.salary,
      department_id[0].id
    );
  },
};
