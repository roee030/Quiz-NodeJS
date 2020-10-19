const express = require("express");
const path = require("path");
const app = express();
const users = require("./db/users.json");
const questions = require("./db/questions.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
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
    friendResults = getMyAnswersByUserName(userName, friendUserName);
    if (friendResults) {
      const score = getRank(user[0].userResults, friendResults);
      res.status(200).json(score);
    } else {
      res
        .status(400)
        .send(
          friendUserName + " did not answer yet to " + userName + " survey"
        );
    }
  }
});

//Save new User to db
app.post("/quiz/:userName/create", (req, res) => {
  const { userName, userResults } = req.body;
  if (!userName || !userResults) {
    res.status(400).send("You didnt send user data to the body");
  }
  const checkDuplicate = checkDuplicateUserName(userName);
  if (checkDuplicate.length > 0) {
    res.status(400).send(`${userName} already taken. try agian`);
  } else {
    const userData = {
      userName,
      id: parseInt(uuidv4()),
      userResults,
    };
    let usersdb = JSON.parse(readFromFile("./db/users.json"));
    usersdb.push(userData);
    const dataJson = JSON.stringify(usersdb);

    fs.writeFileSync("./db/users.json", dataJson);
    console.log("Here at post method");
    // addDataToUserdb(users);
  }
});

app.put("/quiz/:userNameToChange/update", (req, res) => {
  const { userNameToChange } = req.params;

  console.log(userNameToChange);
  const { userName, userResults } = req.body;
  if (!userName || !userResults) {
    res.status(400).send("You didnt send user data to the body");
  }
  const checkDuplicate = checkDuplicateUserName(userNameToChange);
  if ((checkDuplicate.length = 0)) {
    res.status(400).send(`This user ${userName} not exist `);
  } else {
    users.forEach((u, i) => {
      if (u.userName === userNameToChange) {
        console.log("asdf");

        let usersdb = JSON.parse(readFromFile("./db/users.json"));
        usersdb[i].userName = userName;
        usersdb[i].userResults = userResults;
        fs.writeFileSync("./db/users.json", JSON.stringify(usersdb));
      }
    });
  }
});

//Functions

const addDataToUserdb = (obj) => {
  try {
    fs.readFile("./db/users.json", function (err, data) {
      let json = JSON.parse(readFromFile("./db/users.json"));
      json.push(obj);
      fs.writeFile("./db/users.json", JSON.stringify(json));
    });
  } catch (err) {
    console.log(err);
  }
};

const checkDuplicateUserName = (userName) => {
  let usersdb = JSON.parse(readFromFile("./db/users.json"));
  return usersdb.filter((u) => u.userName == userName);
};

const readFromFile = (filename) => {
  try {
    const dataBuffer = fs.readFileSync(filename);
    const dataJSON = dataBuffer.toString();
    return dataJSON;
  } catch (e) {
    return [];
  }
};
const getMyAnswersByUserName = (userName, friendUserName) => {
  let usersdb = JSON.parse(readFromFile("./db/users.json"));
  userResults = usersdb.filter((u) => u.userName === userName);

  friendGuess = userResults[0].friendsGuess.filter(
    (f) => f.userName == friendUserName
  );
  return friendGuess[0] ? friendGuess[0].QuizAnswers : null;
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
