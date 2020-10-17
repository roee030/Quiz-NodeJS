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
//Get all question and answers for specific username
app.get("/quiz/results/:userName", (req, res) => {
  const userNameFromParams = req.params;
  const dataFilterByUserName = [];
  users.filter((u) => {
    if (u.userName == userNameFromParams.userName) dataFilterByUserName.push(u);
  });
  console.log(dataFilterByUserName);
  if (dataFilterByUserName.length > 0) {
    res.status(200).json(dataFilterByUserName.userResults);
  } else {
    res
      .status(400)
      .send(`There is no user like ${userNameFromParams.userName}`);
  }
});
