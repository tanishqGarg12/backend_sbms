const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// Middleware to authenticate user requests
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admins",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};

// Middleware to check if the user is a normal user
exports.isUser = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.role !== "user") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for users",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};