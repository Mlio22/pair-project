const { Question, QuestionAnswer, Quiz, Tag, QuizTag, User, UserQuiz } = require("../models");
const {Op} = require('sequelize')

class PlayerQuizController {
  static async showQuizzes(req, res) {
    try {
      // todo: pindahin ke static method model
      // todo: buat query sorting berdasarkan jumlah soal
      // todo: buat query search berdasarkan tag (done)
      const { tag } = req.query;

      let tagQuery = {};
      if (tag) {
        tagQuery.where = {
          name: {
            [Op.eq]: tag
          }
        }
      }

      let data = await Quiz.findAll({
        include: [
          {
            model: Question,
            attributes: ["id"],
          },
          {
            model: Tag,
            attributes: ['id', 'name'],
            ...tagQuery
          },
        ],
      });

      data = data.filter(quiz => {
        return quiz.Questions.length > 0
      })

      return res.render("player/quiz-list", {
        title: "Quiz List",
        quizData: data,
      });
    } catch (error) {
      // todo: tampilkan error
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

      return res.redirect(`/quiz/player/${quizId}/question/1`);
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async getQuestionById(req, res) {
    try {
      const { quizId, order } = req.params;
      // todo: pindahin ke static method model

      let selectedQuestion = await Question.findAll({
        attributes: ["id", "question", "QuizId"],
        where: {
          QuizId: quizId,
        },
        include: QuestionAnswer,
        order: [["id", "asc"]],
      });

      if (order >= selectedQuestion.length) {
        res.redirect(`/quiz/player/${quizId}/result`);
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

      // todo: pindahin ke static method model
      let selectedQuestion = await Question.findAll({
        attributes: ["id"],
        where: {
          QuizId: quizId,
        },
      });

      selectedQuestion = selectedQuestion[order];

      // todo: pindahin ke static method model
      const rightAnswer = await QuestionAnswer.findOne({
        attributes: ["id", "rightAnswer", "choice"],
        where: {
          rightAnswer: true,
          QuestionId: selectedQuestion.id,
        },
      });

      const userId = req.session.user?.id;

      if (rightAnswer.choice === answer) {
        await UserQuiz.increment("score", {
          by: 1,
          where: { UserId: userId },
          order: [["updatedAt", "DESC"]],
        });
      }

      return res.redirect(`/quiz/player/${quizId}/question/${order + 1}`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async getResult(req, res) {
    try {
      const { quizId } = req.params;

      // todo: pindahin ke static method model
      const selectedData = await UserQuiz.findOne({
        attributes: ["score"],
        where: {
          QuizId: quizId,
        },
        order: [["updatedAt", "DESC"]],
      });

      // todo: pindahin ke static method model
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
