const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(require("./router"));

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
