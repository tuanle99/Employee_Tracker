// require("dotenv").config();

const connection = require("./config/connection");
const question = require("./src/js/question");

async function init() {
  console.clear();
  question.ask_questions();
}

init();
