const adminAuth = (req, res, next) => {
  console.log("Default handler route");
  const token = "xyz";
  const isAuthorised = token === "xyz";
  if (!isAuthorised) {
    res.status(401).send("Unauthorised Request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("Default handler route");
  const token = "xyz";
  const isAuthorised = token === "xyz";
  if (!isAuthorised) {
    res.status(401).send("Unauthorised Request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
