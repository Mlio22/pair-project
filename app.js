const express = require("express");
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(session({
  secret: 'ini secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure:  false,
    sameSite: true
  }
}))
app.use(require("./router"));

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
