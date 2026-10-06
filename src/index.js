const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Welcome to testing the Node.JS app");
});

app.use("/hello", (req, res) => {
  res.send("Hello from NodeJS");
});

app.use("/", (req, res) => {
  res.send("welcome to learning Node.JS");
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777...");
});
