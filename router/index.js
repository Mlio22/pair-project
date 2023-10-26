const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {});
});

router.use(require("./user"));
router.use("/quiz", require("./quiz"));

// todo: not found page
router.get('*', (req, res) => {
  res.send('anda salah tempat kali?!', 404)
})

module.exports = router;
