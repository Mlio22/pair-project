"use strict";
const bcrypt = require("bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Quiz);
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Username must not be empty.",
          },
          notEmpty: {
            args: true,
            msg: "Username must not be empty.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Name must not be empty.",
          },
          notEmpty: {
            args: true,
            msg: "Name must not be empty.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Password must not be empty.",
          },
          notEmpty: {
            args: true,
            msg: "Password must not be empty.",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Role must not be empty.",
          },
          notEmpty: {
            args: true,
            msg: "Role must not be empty.",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (data, options) => {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(data.password, salt);

          data.password = hash;
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
