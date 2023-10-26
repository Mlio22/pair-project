"use strict";

const { Quiz, Tag, QuizTag, QuestionAnswer, Question } = require("../models");

const fs = require("fs");
const quizzesFilenames = ["general1.json", "geo1.json", "history1.json", "history2.json"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    for (const filename of quizzesFilenames) {
      const quiz = JSON.parse(fs.readFileSync(`./data/questions/${filename}`));

      const { name, description, tags, questions, UserId } = quiz;

      const quizInstance = await Quiz.create({ name, description, UserId });
      for (const tag of tags) {
        const selectedTagInstance = await Tag.findOne({
          where: {
            name: tag,
          },
        });

        await QuizTag.create({
          QuizId: quizInstance.id,
          TagId: selectedTagInstance.id,
        });
      }

      if (!questions) {
        console.log(filename);
      }

      for (const questionUnit of questions) {
        let { question, answers, imageFilename, rightAnswer } = questionUnit;

        imageFilename = imageFilename || null;

        const questionInstance = await Question.create({ question, imageFilename });
        for (const answer in answers) {

          let isRightAnswer = answer === rightAnswer;

          await QuestionAnswer.create({
            choice: answer,
            rightAnswer: isRightAnswer,
            QuestionId: questionInstance.id,
          });
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
