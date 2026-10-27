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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "about",
    "skills",
    "gender",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key),
  );

  return isEditAllowed;
};

const validateForgetPasswordData = (req) => {
  if (!validator.isEmail(req.body.emailId)) {
    throw new Error("Invalid Credentials");
  } else if (!validator.isStrongPassword(req.body.newPassword)) {
    throw new Error("Password is not strong");
  }
};

module.exports = {
  validators,
  validateEditProfileData,
  validateForgetPasswordData,
};
