const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started and is listen to port 5000");
});
//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
