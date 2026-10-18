const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedData = await jwt.verify(token, "DevSwipe@2026");
    const { _id } = decodedData;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not found");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new Error("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
