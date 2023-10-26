const { Question, QuestionAnswer, Quiz, Tag, User, UserQuiz } = require("../models");
const { Op, or } = require("sequelize");

class PlayerQuizController {
  static async showQuizzes(req, res) {
    try {
      let data = await Quiz.findAll({
        attributes: ["id", "name", "description"],
        include: {
          attributes: ["id"],
          model: Question,
        },
      });

      return res.render("player/quiz-list", {
        title: "Quiz List",
        quizData: data,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async startQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const userId = req.session.user?.id || 1;

      await UserQuiz.create({
        UserId: userId,
        QuizId: quizId,
      });

      return res.redirect(`/quiz/${quizId}/question/1`);
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async getQuestionById(req, res) {
    try {
      const { quizId, order } = req.params;

      let selectedQuestion = await Question.findAll({
        attributes: ["id", "question", "QuizId"],
        where: {
          QuizId: quizId,
        },
        include: QuestionAnswer,
        order: [["id", "asc"]],
      });

      if (order >= selectedQuestion.length) {
        res.redirect(`/quiz/${quizId}/result`);
      }

      selectedQuestion = selectedQuestion[order];

      return res.render("player/quiz-question", { selectedQuestion, title: "Question", order });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async answerQuestion(req, res) {
    try {
      let { quizId, order } = req.params;
      const { answer } = req.body;

      order = +order;

      let selectedQuestion = await Question.findAll({
        attributes: ["id"],
        where: {
          QuizId: quizId,
        },
      });

      selectedQuestion = selectedQuestion[order];

      const rightAnswer = await QuestionAnswer.findOne({
        attributes: ["id", "rightAnswer", "choice"],
        where: {
          rightAnswer: true,
          QuestionId: selectedQuestion.id,
        },
      });

      const userId = req.session.user?.id || 1;

      if (rightAnswer.choice === answer) {
        await UserQuiz.increment("score", {
          by: 1,
          where: { UserId: userId },
          order: [["updatedAt", "DESC"]],
        });
      }

      return res.redirect(`/quiz/${quizId}/question/${order + 1}`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async getResult(req, res) {
    try {
      const { quizId } = req.params;

      const selectedData = await UserQuiz.findOne({
        attributes: ["score"],
        where: {
          QuizId: quizId,
        },
        order: [["updatedAt", "DESC"]],
      });

      const selectedQuiz = await Quiz.findOne({
        attributes: [],
        where: {
          id: quizId,
        },
        include: {
          model: Question,
          attributes: ["id"],
        },
      });

      res.render("player/quiz-result", { selectedData, selectedQuiz });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = PlayerQuizController;
