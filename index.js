const express = require("express");
const path = require("path");
const app = express();
const users = require("./db/users.json");
const questions = require("./db/questions.json");
const fs = require("fs");

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
  if (!userNameFromParams) {
    return res.status(400).send("invalid input");
  }
  let usersdb = JSON.parse(readFromFile("./db/users.json"));
  let finalData = [];
  usersdb.filter((u) => {
    if (u.userName == userNameFromParams.userName) {
      finalData.push(u);
    }
  });
  if (finalData.length > 0) {
    res.status(200).json(finalData[0].userResults);
  } else {
    res
      .status(400)
      .send(`There is no user like ${userNameFromParams.userName}`);
  }
});
//Get friends rank
app.get("/quiz/results/:userName/rank/:friendUserName", (req, res) => {
  const { userName, friendUserName } = req.params;
  if (!userName || !friendUserName) {
    res.status(400).send("invaild users input");
  }
  let usersdb = JSON.parse(readFromFile("./db/users.json"));
  const user = usersdb.filter((u) => u.userName === userName);
  if (!user[0]) {
    res.status(400).send("There is no user like " + userName);
  }
  if (!user[0].friendsGuess) {
    res.status(400).send("No one answer to " + userName + " survey");
  }
  if (user[0].friendsGuess) {
    const friendGuess = user[0].friendsGuess.filter(
      (g) => g.userName == friendUserName
    );

    friendResults = getMyAnswersByUserName(userName, friendUserName);
    const score = getRank(user[0].userResults, friendResults);
    console.log(score);
    // console.log(score);
    // friendGuess
    //   ? res.status(200).json(friendGuess[0].QuizAnswers)
    //   : res
    //       .status(400)
    //       .send(
    //         friendUserName + " did not answer yet to " + userName + " survey"
    //       );
  }
});
const readFromFile = (filename) => {
  const dataBuffer = fs.readFileSync(filename);
  const dataJSON = dataBuffer.toString();
  return dataJSON;
};
const getMyAnswersByUserName = (userName, friendUserName) => {
  let usersdb = JSON.parse(readFromFile("./db/users.json"));
  userResults = usersdb.filter((u) => u.userName === userName);

  friendGuess = userResults[0].friendsGuess.filter(
    (f) => f.userName == friendUserName
  );
  return friendGuess[0].QuizAnswers;
};
const getRank = (userResult, friendResult) => {
  let score = 0;
  for (const key in userResult) {
    if (userResult[key].answerId == friendResult[key].answerId) {
      score++;
    }
  }
  return (score / userResult.length) * 100 + "%";
};
