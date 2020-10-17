const express = require("express");
const path = require("path");
const app = express();
const users = require("./db/users.json");
const questions = require("./db/questions.json");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started and is listen to port 5000");
});
//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//REST API
app.get("/", (req, res) => {
  res.send("<h1>Hello, This is NodeJS App</h1>");
});

app.get("/quiz/results/:username", (req, res) => {
  const userName = req.params;
  const user = users.filter((user) => {
    user.userName === userName;
  });
  if (user) {
    res.status(200).json(user.userResults);
  } else {
    res.status(400).send(`There is no user like ${req.params}`);
  }
});
