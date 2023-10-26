"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserQuizzes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      QuizId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Quizzes",
          key: "id",
        },
      },
      score: {
        type: Sequelize.INTEGER,
      },
      // todo: buat attribut indikator posisi user
      // todo: buat attribut jumlah benar user
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserQuizzes");
  },
};
