const express = require('express');
const { signup, googleSignup, login, sendOtp, changePassword, getAllUsers } = require('../controllers/user');
const { resetPasswordToken, resetPassword } = require("../controllers/resetPassword");
const { auth, isAdmin } = require("../middlewares/auth");
const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/google-signup', googleSignup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/change-password', auth, changePassword);

// Reset Password routes
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// Admin routes
router.get("/getalluser", auth, isAdmin, getAllUsers);

// Export the router for use in the main application
module.exports = router;
