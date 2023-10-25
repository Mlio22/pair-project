const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send('awikwok')
});
router.get("/login");
router.get("/register");
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
