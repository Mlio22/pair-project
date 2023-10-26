const express = require("express");
const router = express.Router();

router.use(function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
});

router.get("/quiz-list");
router.get("/quiz");
router.get("/quiz/:quizId");
router.get("/quiz/:quizId/soal/:soalId");
router.get("/quiz/:quizId/result");

router.get("/quiz/add");
router.get("/quiz/:quizId");
router.get("/quiz/:quizId/edit");
router.get("/quiz/:quizId/delete");
router.get("/quiz/:quizId/:soalId/edit");
router.get("/quiz/:quizId/:soalId/delete");

module.exports = router;
