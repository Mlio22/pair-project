const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

const checkLogin = (req, res, next) => {
  console.log(req.session);
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};

router.get("/register", checkLogin, UserController.showRegisterForm);
router.post("/register", checkLogin, UserController.register);

router.get("/login", checkLogin, UserController.showLoginForm);
router.post("/login", checkLogin, UserController.login);

router.get("/logout", UserController.logout);

module.exports = router;
