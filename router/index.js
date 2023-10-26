const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("awikwok");
});

router.use(require("./user"));
router.use('/quiz', require("./quiz"));

module.exports = router;
