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

const add_department_questions = {
  type: "input",
  message: "What is the department name? ",
  name: "department_name",
};

module.exports = {
  view_employee_by_department: async function view_employee_by_department() {
    const department_list = await get_department_list();
    const department = await generate_question(department_list);
    //console is not waiting for generate question

    const department_data = await get_query("department", "name", department);
    const role_data = await get_query(
      "role",
      "department_id",
      department_data[0].id
    );

    let table = [];
    for (var i = 0; i < role_data.length; i++) {
      let e = {};
      const o = await get_query("employee", "role_id", role_data[i].id);
      e.id = o[0].id;
      e.first_name = o[0].first_name;
      e.last_name = o[0].last_name;
      e.role_id = o[0].role_id;
      e.manager_id = o[0].manager_id;
      table.push(e);
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
};
