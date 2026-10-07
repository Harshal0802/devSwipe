const express = require("express");

const app = express();

app.use("/admin", (req, res, next) => {
  console.log("Default handler route");
  const token = "xsdfayz";
  const isAuthorised = token === "xyz";
  if (!isAuthorised) {
    res.status(401).send("Unauthorised Request");
  } else {
    next();
  }
});

app.get("/admin/getAllData", (req, res) => {
  res.send("Submitted all data");
});

app.delete("/admin/deleteAllData", (req, res) => {
  res.send("All Data is deleted");
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777...");
});
