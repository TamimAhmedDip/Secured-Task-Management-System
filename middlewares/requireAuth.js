const jwt = require("jsonwebtoken");
// const User = require("../model/userModel");

const requireAuth = async (req, res, next) => {
  //verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, fullname, email } = jwt.verify(token, process.env.JWT_SECRET);
    req.body.user_data = {
      _id,
      fullname,
      email,
    };
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ error: "Request not authorized" });
  }
};

module.exports = requireAuth;
