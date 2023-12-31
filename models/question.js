"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.Quiz);
      Question.hasMany(models.QuestionAnswer);
    }
  }
  Question.init(
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Question must not be empty."
          },
          notEmpty: {
            args: true,
            msg: "Question must not be empty."
          },
        },
      },
      imageFilename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      QuizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "QuizId must not be empty."
          },
          isInt: {
            args: true,
            msg: "QuizId must be an integer."
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
