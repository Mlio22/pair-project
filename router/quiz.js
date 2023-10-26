const express = require("express");
const router = express.Router();
const PlayerQuizController = require("../controllers/PlayerQuizController.js");
const AdminQuizController = require("../controllers/AdminQuizController.js");

// router.use(function (req, res, next) {
//   if (!req.session.user) {
//     res.redirect("/login");
//   } else {
//     next();
//   }
// });

let isAdmin = true;
let isPlayer = false;

function checkUser(req, res, next) {
  next();
  // if (!req.session.user) {
  //   res.redirect("/login");
  // } else {
  //   next();
  // }
}

function checkPlayer(req, res, next) {
  next();
  // if (req.session.user?.role === "Player" || isPlayer) {
  //   next();
  // } else {
  //   res.redirect("/quiz");
  // }
}

function checkAdmin(req, res, next) {
  next();
  // if (req.session.user?.role === "Admin" || is) {
  //   next();
  // } else {
  //   res.redirect("/quiz");
  // }
}

// npx sequelize-cli model:generate --name UserQuiz --attributes UserId:integer,QuizId:integer

// player
router.get("/", checkUser, checkPlayer, PlayerQuizController.showQuizzes); //check
router.get("/:quizId/startQuiz", checkUser, checkPlayer, PlayerQuizController.startQuiz);
router.get("/:quizId/question/:order", checkUser, checkPlayer, PlayerQuizController.getQuestionById);
router.post("/:quizId/question/:order", checkUser, checkPlayer, PlayerQuizController.answerQuestion);
router.get("/:quizId/result", checkUser, checkPlayer, PlayerQuizController.getResult);

// admin
// router.get("/", checkUser, checkAd min, AdminQuizController.showQuizzes); //check
// router.get("/add", checkUser, checkAdmin, AdminQuizController.showAddQuiz); 
// router.post("/add", checkUser, checkAdmin, AdminQuizController.createQuiz);
// router.get("/:quizId", checkUser, checkAdmin, AdminQuizController.getQuizDetailById);
// router.get("/:quizId/edit", checkUser, checkAdmin, AdminQuizController.showEditQuizById); //check
// router.post("/:quizId/edit", checkUser, checkAdmin, AdminQuizController.updateQuizById);
// router.get("/:quizId/delete", checkUser, checkAdmin, AdminQuizController.deleteQuizById);
// router.get("/:quizId/addQuestion", checkUser, checkAdmin, AdminQuizController.showAddQuestionQuizById);
// router.post("/:quizId/addQuestion", checkUser, checkAdmin, AdminQuizController.createQuestionQuizById);
// router.get("/:quizId/:questionId/edit", checkUser, checkAdmin, AdminQuizController.showEditQuestionById); //check
// router.post("/:quizId/:questionId/edit", checkUser, checkAdmin, AdminQuizController.updateQuestionById);
// router.get("/:quizId/:questionId/delete", checkUser, checkAdmin, AdminQuizController.deleteQuestionById);

module.exports = router;
