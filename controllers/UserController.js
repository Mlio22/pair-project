const bcrypt = require("bcrypt");
const { User } = require("../models");

class UserController {
  static async showRegisterForm(req, res) {
    try {
      res.render("auth-pages/register-form");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      await User.create({ username, email, password, role });
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async showLoginForm(req, res) {
    try {
      res.render("auth-pages/login-form");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const selectedUser = await User.findOne({
        attributes: ["id", "username", "password", "role"],
        where: { username },
      });

      if (selectedUser) {
        const isvalid = bcrypt.compareSync(password, selectedUser.password);

        if (isvalid) {
          req.session.user = {
            id: selectedUser.id,
            role: selectedUser.role,
          };

          res.send("okeh");
        } else {
          res.send("gagal");
          // todo: error dengan detail
        }
      } else {
        res.redirect("/login");
        // todo: error dengan detail
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async logout(req, res) {
    try {
      if (req.session.user) {
        req.session.destroy();
      }

      res.redirect('/login')
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = UserController;
