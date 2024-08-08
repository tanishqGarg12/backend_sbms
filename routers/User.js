// routes/auth.js

const express = require('express');
const { signup, googleSignup, login, sendOtp, changePassword } = require('../controllers/user');
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword")

const { auth } = require("../middlewares/auth")
const router = express.Router();

router.post('/signup', signup);
router.post('/google-signup', googleSignup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/change-password', auth, changePassword);

module.exports = router;

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router

