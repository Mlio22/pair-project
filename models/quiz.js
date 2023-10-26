"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Quiz.belongsTo(models.User);
      Quiz.hasMany(models.Question);
      Quiz.belongsToMany(models.Tag, { through: "QuizTag", foreignKey: "QuizId" });
    }

    get totalQuestions() {
      return this.Questions.length;
    }
  }
  Quiz.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Name must not be null.",
          },
          notEmpty: {
            args: true,
            msg: "Name must not be empty.",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "UserId must not be null.",
          },
          notEmpty: {
            args: true,
            msg: "UserId must not be empty.",
          },
          isInt: {
            args: true,
            msg: "UserId must be an integer.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Quiz",
    }
  );
  return Quiz;
};
