const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to six characters");
  }
  //check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already registered");
  }
  //create new user
  const user = User.create({
    name,
    email,
    password,
  });
  // generate token
  const token = generateToken(user._id);

  //send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });
  if (user) {
    const { _id, name, email, photo } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  //to check if user password corresponds to the one registered
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //generate token
  const token = generateToken(user._id);
  if (passwordIsCorrect) {
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
  }
  if (user && passwordIsCorrect) {
    const { _id, name, email, photo } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

//get user data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    const { _id, name, email, photo } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

//get login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //verify token before returning true
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return false;
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
};

/* {
    "name": "demmydev1",
    "email": "demmy12@gmail.com",
    "password": "abcdefgh",
    "photo": "https://i.ibb.co/4pDNDk1/avatar.png"
    } */
/* {
    "name": "demmydev",
    "email": "demmy@gmail.com",
    "password": "1234567",
    "photo": "https://i.ibb.co/4pDNDk1/avatar.png"
    }

{
"email": "demmydev12@gmail.com",
"password": "abcdefgh"
}
    
    {
    "title": "shop",
    "amount": 500,
    "category": "wages",
    "description": "wages from shop",
    "date": "12-12-2023"
    }

    {
"title": "rent",
"amount": 100,
"category": "salary",
"description": "salary for labour",
"date": "29-09-2023"
}
    */
