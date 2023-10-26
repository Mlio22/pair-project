const { Question, QuestionAnswer, Quiz, Tag, User } = require("../models");
const { Op } = require("sequelize");

class Controller {
  static async index(req, res) {
    try {

    }
    catch(error) {
      console.log(error);
      res.send(error);
    }
  }
  
  
  static async showQuizes(req, res) {
    try {
      let data = await Quiz.findAll({
        include: {
          model: User,
          required: true
        }
      });
      res.render("quiz-list", {
        title: "Quiz List",
        quizData: data,
      });
    }
    catch(error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller