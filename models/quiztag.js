'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QuizTag.init({
    QuizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "QuizId must not be empty"
        },
        isInt: {
          args: true,
          msg: "QuizId must be a integer."
        },
     }, 
    },
    TagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "TagId must be a integer."
        },
        isInt: {
          args: true,
          msg: "TagId must be a integer."
        },
     },
    }
  }, {
    sequelize,
    modelName: 'QuizTag',
  });
  return QuizTag;
};