'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tag.belongsToMany(models.Quiz, {through: 'QuizTag', foreignKey: 'TagId'});
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Name must not be empty."
        },
        notEmpty: {
          args: true,
          msg: "Name must not be empty."
        },
     },
    },
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};