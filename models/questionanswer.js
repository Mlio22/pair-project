'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuestionAnswer.belongsTo(models.Question);
    }
  }
  QuestionAnswer.init({
    choice: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Choice must not be empty."
        },
        notEmpty: {
          args: true,
          msg: "Choice must not be empty."
        },
     },
    },
    rightAnswer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "rightAnswer must not be empty."
        },
     },
    },
    QuestionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "QuestionId must not be empty."
        },
        isInt: {
          args: true,
          msg: "QuestionId must be an integer."
        },
     },
    }
  }, {
    sequelize,
    modelName: 'QuestionAnswer',
  });
  return QuestionAnswer;
};