const { getErrorMessages, retrieveErrors } = require("../helper/helper");
const { Question, QuestionAnswer, Quiz, Tag, User, QuizTag } = require("../models");
const { Op } = require("sequelize");

class AdminQuizController {
  static async showQuizzes(req, res) {
    // todo: pindahin ke static method model
    try {
      const { tag, success } = req.query;

      let tagQuery = {};
      if (tag) {
        tagQuery.where = {
          name: {
            [Op.eq]: tag,
          },
        };
      }

      let data = await Quiz.findAll({
        include: [
          {
            model: Question,
            attributes: ["id"],
          },
          {
            model: Tag,
            attributes: ["id", "name"],
            ...tagQuery,
          },
        ],
        order: [["id", "asc"]],
      });

      return res.render("admin/quiz-list", {
        title: "Quiz Lists",
        role: "Admin",
        quizData: data,
        success,
      });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async showAddQuiz(req, res) {
    try {
      let { errors } = req.query;

      errors = retrieveErrors(errors);

      let tags = await Tag.findAll({
        order: [["id", "asc"]],
      });
      return res.render("admin/quiz-add", {
        title: "Add Quiz",
        tags: tags,
        errors,
      });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async createQuiz(req, res) {
    try {
      const userId = req.session.user?.id || 1;

      let { name, description, tag } = req.body;

      if (!tag) {
        return res.redirect("/quiz/admin/add?errors=Must use tag");
      }

      // todo: pindahin ke static method model
      let addQuiz = await Quiz.create({
        name: name,
        description: description,
        UserId: userId,
      });

      // todo: pindahin ke static method model
      await tag.forEach((el) => {
        QuizTag.create({
          TagId: el,
          QuizId: addQuiz.id,
        });
      });

      return res.redirect("/quiz/admin?success=Successfully added new Quiz");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // todo: helper function getErrors (done)
        const errors = getErrorMessages(error);

        return res.redirect(`/quiz/admin/add?errors=${errors}`);
      }

      console.log(error);
      return res.send(error);
    }
  }

  static async getQuizDetailById(req, res) {
    try {
      const { quizId } = req.params;

      // todo: pindahin ke static method model
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

      return res.render("admin/quiz-detail", { selectedQuiz, title: "Quiz Detail" });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async showEditQuizById(req, res) {
    try {
      let { errors } = req.query;
      errors = retrieveErrors(errors);

      const { quizId } = req.params;

      // todo: pindahin ke static method model
      let tags = await Tag.findAll({
        attributes: ["id", "name"],
      });

      // todo: pindahin ke static method model
      let quizData = await Quiz.findOne({
        attributes: ["id", "name", "description"],
        where: {
          id: quizId,
        },
        include: {
          model: Tag,
          attributes: ["id"],
        },
      });

      const selectedTagIds = quizData.Tags.map((tag) => tag.id);

      return res.render("admin/quiz-edit", {
        title: "Quiz Edit",
        quizData: quizData,
        tags: tags,
        selectedTagIds,
        errors,
      });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async updateQuizById(req, res) {
    try {
      let { quizId } = req.params;
      let { name, description, tag } = req.body;

      if (!tag) {
        return res.redirect(`/quiz/admin/${quizId}/edit?errors=Must use tag`);
      }

      // todo: pindahin ke static method model
      await Quiz.update(
        {
          name: name,
          description: description,
        },
        { where: { id: quizId } }
      );

      // todo: pindahin ke static method model
      await QuizTag.destroy({
        where: {
          QuizId: quizId,
        },
      });

      // todo: pindahin ke static method model
      if (typeof tag === "string") tag = [parseInt(tag)];

      await tag.forEach((el) => {
        QuizTag.create({
          TagId: el,
          QuizId: quizId,
        });
      });

      return res.redirect("/quiz/admin?success=Quiz editted Successfully ");
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async deleteQuizById(req, res) {
    try {
      const { quizId } = req.params;

      // todo: pindahin ke static method model
      let quizDelete = await Quiz.destroy({
        where: {
          id: +quizId,
        },
      });
      return res.redirect("/quiz/admin?success=Quiz deleted Successfully");
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async showAddQuestionQuizById(req, res) {
    try {
      const { quizId } = req.params;
      let {error} = req.query;

      error = retrieveErrors(error);

      return res.render("admin/question-add", {
        title: "Add Question",
        quizId,
        error
      });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async createQuestionQuizById(req, res) {
    try {
      const { quizId } = req.params;
      const { question, rightAnswer, wrongAnswer } = req.body;

      // todo: pindahin ke static method model
      const questionInstance = await Question.create({
        question,
        QuizId: quizId,
      });

      // todo: pindahin ke static method model
      await QuestionAnswer.create({
        choice: rightAnswer,
        rightAnswer: true,
        QuestionId: questionInstance.id,
      });

      // todo: pindahin ke static method model
      await wrongAnswer.forEach((wrong) => {
        QuestionAnswer.create({
          choice: wrong,
          rightAnswer: false,
          QuestionId: questionInstance.id,
        });
      });

      return res.redirect(`/quiz/admin/${quizId}`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // todo: helper function getErrors (done)
        const errors = getErrorMessages(error);

        return res.redirect(`/quiz/admin/${{id}?errors=${errors}`);
      }

      console.log(error);
      return res.send(error);
    }
  }

  static async showEditQuestionById(req, res) {
    try {
      const { quizId, questionId } = req.params;

      // todo: pindahin ke static method model
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

      // todo: pindahin ke static method model
      const rightAnswer = selectedQuestion.QuestionAnswers.find((questionAnswer) => questionAnswer.rightAnswer);
      const wrongAnswers = selectedQuestion.QuestionAnswers.filter((questionAnswer) => !questionAnswer.rightAnswer);

      return res.render("admin/question-edit", { quizId, selectedQuestion, rightAnswer, wrongAnswers, title: "Edit Question" });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  

  static async updateQuestionById(req, res) {
    try {
      const { quizId, questionId } = req.params;
      const { question, rightAnswer, wrongAnswer } = req.body;

      // todo: pindahin ke static method model
      await Question.update(
        { question },
        {
          where: {
            id: questionId,
          },
        }
      );

      // todo: pindahin ke static method model
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

      // todo: pindahin ke static method model
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

      return res.redirect(`/quiz/admin/${quizId}`);
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  static async deleteQuestionById(req, res) {
    try {
      const { quizId, questionId } = req.params;

      // todo: pindahin ke static method model
      await Question.destroy({
        where: {
          id: questionId,
        },
      });

      // todo: pindahin ke static method model
      await QuestionAnswer.destroy({
        where: {
          QuestionId: questionId,
        },
      });

      return res.redirect(`/quiz/admin/${quizId}`);
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }
}

module.exports = AdminQuizController;
