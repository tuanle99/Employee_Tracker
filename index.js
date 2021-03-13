// require("dotenv").config();

const connection = require("./config/connection");
const question = require("./src/js/question");

async function init() {
  question.ask_questions();
}

init();
