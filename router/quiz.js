const express = require("express");
const router = express.Router();
const PlayerQuizController = require("../controllers/PlayerQuizController.js");
const AdminQuizController = require("../controllers/AdminQuizController.js");

let isAdmin = false;
let isPlayer = false;

function checkUser(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

function checkPlayer(req, res, next) {
  if (req.session.user?.role === "Player" || isPlayer) {
    console.log();
    next();
  }
}

function checkAdmin(req, res, next) {
  if (req.session.user?.role === "Admin" || isAdmin) {
    console.log("admin");
    next();
  }
}

// npx sequelize-cli model:generate --name UserQuiz --attributes UserId:integer,QuizId:integer

router.get("/", checkUser, (req, res) => {
  if (req.session.user?.role === "Admin") {
    res.redirect("/quiz/admin");
  } else if (req.session.user?.role === "Player") {
    res.redirect("/quiz/player");
  }
});

// player
router.get("/player/", checkUser, checkPlayer, PlayerQuizController.showQuizzes); //check
router.get("/player/:quizId/startQuiz", checkUser, checkPlayer, PlayerQuizController.startQuiz);
router.get("/player/:quizId/question/:order", checkUser, checkPlayer, PlayerQuizController.getQuestionById);
router.post("/player/:quizId/question/:order", checkUser, checkPlayer, PlayerQuizController.answerQuestion);
router.get("/player/:quizId/result", checkUser, checkPlayer, PlayerQuizController.getResult);

// admin
router.get("/admin", checkUser, checkAdmin, AdminQuizController.showQuizzes); //check
router.get("/admin/add", checkUser, checkAdmin, AdminQuizController.showAddQuiz);
router.post("/admin/add", checkUser, checkAdmin, AdminQuizController.createQuiz);
router.get("/admin/:quizId", checkUser, checkAdmin, AdminQuizController.getQuizDetailById);
router.get("/admin/:quizId/edit", checkUser, checkAdmin, AdminQuizController.showEditQuizById); //check
router.post("/admin/:quizId/edit", checkUser, checkAdmin, AdminQuizController.updateQuizById);
router.get("/admin/:quizId/delete", checkUser, checkAdmin, AdminQuizController.deleteQuizById);
router.get("/admin/:quizId/addQuestion", checkUser, checkAdmin, AdminQuizController.showAddQuestionQuizById);
router.post("/admin/:quizId/addQuestion", checkUser, checkAdmin, AdminQuizController.createQuestionQuizById);
router.get("/admin/:quizId/:questionId/edit", checkUser, checkAdmin, AdminQuizController.showEditQuestionById); //check
router.post("/admin/:quizId/:questionId/edit", checkUser, checkAdmin, AdminQuizController.updateQuestionById);
router.get("/admin/:quizId/:questionId/delete", checkUser, checkAdmin, AdminQuizController.deleteQuestionById);

module.exports = router;
