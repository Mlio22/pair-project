"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserQuiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserQuiz.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "User Should not Empty"
          },
          notNull: {
            args: true,
            msg: "User Should not null"
          }
        }
      },
      QuizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Quiz Should not Empty"
          },
          notNull: {
            args: true,
            msg: "Quiz Should not null"
          }
        }
      },
      score: DataTypes.INTEGER
    },
    {
      hooks: {
        beforeCreate: (data, options) => {
          data.score = 0
        }
      },  
      sequelize,
      modelName: "UserQuiz",
    }
  );
  return UserQuiz;
};
