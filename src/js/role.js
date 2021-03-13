const connection = require("../../config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

async function get_role() {
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

async function generate_question(message, list) {
  let new_list = [];
  for (var i = 0; i < list.length; i++) {
    if (message === "Which department do you choose?") {
      new_list.push(list[i].name);
    }
    if (message === "Choose Role") {
      var o = { value: list[i].id, name: list[i].title };
      new_list.push(o);
    }
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

async function remove_role_helper(role_id) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM role WHERE id = ${role_id}`),
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      };
  });
}

module.exports = {
  view_role: async function view_role() {
    const role = await get_role();
    console.table(role);
  },
  add_role: async function add_role() {
    const department_list = await get_department_list();
    const department_name = await generate_question(
      "Which department do you choose?",
      department_list
    );
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
  remove_role: async function remove_role() {
    const role_list = await get_role();
    const role_id = await generate_question("Choose Role", role_list);
    const remove = remove_role_helper(role_id);
  },
};
