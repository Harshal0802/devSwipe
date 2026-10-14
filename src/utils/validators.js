const validator = require("validator");

const validators = (req) => {
  if (!req.body.firstName || !req.body.lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(req.body.emailId)) {
    throw new Error("email is not valid!");
  } else if (!validator.isStrongPassword(req.body.password)) {
    throw new Error("password is not strong");
  }
};

module.exports = {
  validators,
};
