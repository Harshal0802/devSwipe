const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("../middlewares/utils");

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User Data");
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
