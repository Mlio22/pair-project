const { Question, QuestionAnswer, Quiz, Tag, User, QuizTag } = require("../models");

class AdminQuizController {
  static async showQuizzes(req, res) {
    try {
      let data = await Quiz.findAll({
        include: {
          model: Question,
        },
      });

      res.render("admin/quiz-list", {
        title: "Quiz Lists",
        role: "Admin",
        quizData: data,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async showAddQuiz(req, res) {
    try {
      let tags = await Tag.findAll();
      res.render("admin/quiz-add", {
        title: "Add Quiz",
        tags: tags,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async createQuiz(req, res) {
    try {
      let { name, description, tag } = req.body;

      let addQuiz = await Quiz.create({
        name: name,
        description: description,
      });
      if (tag.length > 1) {
        await tag.forEach((el) => {
          QuizTag.create({
            TagId: el,
            QuizId: addQuiz.id,
          });
        });
      } else if (tag) {
        await QuizTag.create({
          TagId: el,
          QuizId: addQuiz.id,
        });
      }
      res.redirect("/quiz/admin");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async showAddQuestionQuizById(req, res) {
    try {
      const { quizId } = req.params;

      return res.render("admin/question-add", {
        title: "Add Question",
        quizId,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async createQuestionQuizById(req, res) {
    try {
      const { quizId } = req.params;
      const { question, rightAnswer, wrongAnswer } = req.body;

      const questionInstance = await Question.create({
        question,
        QuizId: quizId,
      });

      await QuestionAnswer.create({
        choice: rightAnswer,
        rightAnswer: true,
        QuestionId: questionInstance.id,
      });

      await wrongAnswer.forEach((wrong) => {
        QuestionAnswer.create({
          choice: wrong,
          rightAnswer: false,
          QuestionId: questionInstance.id,
        });
      });

      res.redirect(`/quiz/admin/${quizId}`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async getQuizDetailById(req, res) {
    try {
      const { quizId } = req.params;

      const selectedQuiz = await Quiz.findOne({
        attributes: ["id", "name", "description"],
        where: {
          id: quizId,
        },
        include: {
          model: Question,
          attributes: ["id", "question"],
        },
      });

      res.render("admin/quiz-detail", { selectedQuiz, title: "Quiz Detail" });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async showEditQuizById(req, res) {
    try {
      const { quizId } = req.params;
      let tags = await Tag.findAll({
        attributes: ["id", "name"],
      });
      let quizData = await Quiz.findOne({
        attributes: ["name", "description"],
        where: {
          id: +quizId,
        },
      });
      res.render("admin/quiz-edit", {
        title: "Quiz Edit",
        quizData: quizData,
        tags: tags,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async updateQuizById(req, res) {
    try {
      let { quizId } = req.params;
      let { name, description, tag } = req.body;

      await Quiz.update(
        {
          name: name,
          description: description,
        },
        { where: { id: quizId } }
      );

      await QuizTag.destroy({
        where: {
          QuizId: quizId
        }
      });

      if (tag.length > 1) {
        await tag.forEach((el) => {
          QuizTag.create({
            TagId: el,
            QuizId: quizId,
          });
        });
      } else if (tag) {
        await QuizTag.create({
          TagId: el,
          QuizId: quizId,
        });
      }

      
      res.redirect("/quiz/admin")
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async deleteQuizById(req, res) {
    try {
      const { quizId } = req.params;

      let quizDelete = await Quiz.destroy({
        where: {
          id: +quizId,
        },
      });
      res.redirect("/quiz/admin");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async showEditQuestionById(req, res) {
    try {
      const { quizId, questionId } = req.params;

      const selectedQuestion = await Question.findOne({
        attributes: ["id", "question", "imageFilename"],
        where: {
          id: questionId,
        },
        include: {
          model: QuestionAnswer,
          attributes: ["id", "choice", "rightAnswer"],
        },
      });

      const rightAnswer = selectedQuestion.QuestionAnswers.find((questionAnswer) => questionAnswer.rightAnswer);
      const wrongAnswers = selectedQuestion.QuestionAnswers.filter((questionAnswer) => !questionAnswer.rightAnswer);

      res.render("admin/question-edit", { quizId, selectedQuestion, rightAnswer, wrongAnswers, title: "Edit Question" });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async updateQuestionById(req, res) {
    try {
      const { quizId, questionId } = req.params;
      const { question, rightAnswer, wrongAnswer } = req.body;

      await Question.update(
        { question },
        {
          where: {
            id: questionId,
          },
        }
      );

      await QuestionAnswer.update(
        {
          choice: rightAnswer,
        },
        {
          where: {
            QuestionId: questionId,
            rightAnswer: true,
          },
        }
      );

      const wrongAnswerInstances = await QuestionAnswer.findAll({
        where: {
          QuestionId: questionId,
          rightAnswer: false,
        },
      });

      for (let i = 0; i < 3; i++) {
        await wrongAnswerInstances[i].update({
          choice: wrongAnswer[i],
        });
      }

      res.redirect(`/quiz/admin/${quizId}`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async deleteQuestionById(req, res) {
    try {
      const { quizId, questionId } = req.params;

      await Question.destroy({
        where: {
          id: questionId,
        },
      });

      await QuestionAnswer.destroy({
        where: {
          QuestionId: questionId,
        },
      });

      res.redirect(`/quiz/admin/${quizId}`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = AdminQuizController;
