const User = require("../model/userModel");
// const { validate } = require("deep-email-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

//Token Generation
const generateToken = (_id, email, fullname) => {
  return jwt.sign({ _id, email, fullname }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

function isValidFullname(fullname) {
  fullname = fullname.trim();

  if (fullname.length < 3) {
    return false;
  }
  if (!/^[a-zA-Z\s]+$/.test(fullname)) {
    return false;
  }

  return true;
}

async function validateUser(email, fullname, password, confirm_password) {
  //   const { valid } = await validate(email);
  //   if (!valid) {
  //     throw Error("Invalid email");
  //   }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (password !== confirm_password) {
    throw Error("Passwords don't match");
  }
  if (!isValidFullname(fullname)) {
    throw Error(
      "Fullname must contain alphabets and atleast 3 characters long"
    );
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw Error("An user with same email exists");
  }
}

const signup = async (req, res) => {
  const { fullname, password, confirm_password, userType, email } = req.body;
  if (!fullname || !password || !confirm_password || !userType || !email) {
    throw Error("Please fill up the fields");
  }
  try {
    await validateUser(email, fullname, password, confirm_password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: hashedPassword,
      userType,
      fullname,
    });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  console.log("BODY: ", req.body);
  const { password, userType, email } = req.body;
  if (!password || !userType || !email) {
    throw Error("Please fill up the fields");
  }
  try {
    if (!validator.isEmail(email)) {
      throw Error("Invalid email");
    }
    const userFound = await User.findOne({ email, userType });
    if (!userFound) {
      throw Error("Account doesn't exist");
    }
    const match = await bcrypt.compare(password, userFound.password);

    if (!match) {
      throw Error("Invalid password");
    }
    const token = generateToken(
      userFound._id,
      userFound.email,
      userFound.fullname
    );
    res.status(200).json({
      user: {
        fullname: userFound.fullname,
        email: userFound.email,
        _id: userType._id,
      },
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const { _id } = req.body.user_data;
  try {
    const user = await User.findById(_id);
    if (!user) {
      throw Error("Error retrieving user data");
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  getUser,
};
