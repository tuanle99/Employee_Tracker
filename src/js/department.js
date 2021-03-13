const connection = require("../../config/connection");
const inquirer = require("inquirer");
const question = require("./question");

async function get_department_list() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM department`, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

async function generate_question(message, list) {
  const new_list = [];
  for (var i = 0; i < list.length; i++) {
    if (message === "Which department do you choose?") {
      new_list.push(list[i].name);
    } else if (message === "Choose Department") {
      var o = { value: list[i].id, name: list[i].name };
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

const add_department_questions = {
  type: "input",
  message: "What is the department name? ",
  name: "department_name",
};

async function remove_department_helper(department_id) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM department where id = ${department_id}`),
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      };
  });
}

module.exports = {
  view_employee_by_department: async function view_employee_by_department() {
    const department_list = await get_department_list();
    const department = await generate_question(
      "Choose Department",
      department_list
    );

    const department_data = await get_query("department", "id", department);
    const role_data = await get_query(
      "role",
      "department_id",
      department_data[0].id
    );

    let table = [];
    for (var i = 0; i < role_data.length; i++) {
      table.push({
        id: role_data[i].id,
        title: role_data[i].title,
        salary: role_data[i].salary,
        department_id: role_data[i].department_id,
      });
    }
    console.table(table);
  },
  add_department: async function add_department() {
    const answer = await inquirer.prompt(add_department_questions);

    connection.query(
      "INSERT INTO department (`name`) VALUES (?)",
      [answer.department_name],
      (err, res) => {
        if (err) console.log(err);
        console.log(
          `${answer.department_name} is added to department database.`
        );
      }
    );
  },
  view_department: async function view_department() {
    const department_list = await get_department_list();
    console.table(department_list);
  },
  remove_department: async function remove_department() {
    const department_list = await get_department_list();
    const department_id = await generate_question(
      "Choose Department",
      department_list
    );
    const remove = remove_department_helper(department_id);
  },
};
