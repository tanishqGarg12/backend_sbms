const bcrypt = require('bcrypt');
const User = require('../models/user');
const OTP = require('../models/otp');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { OAuth2Client } = require('google-auth-library');
const cloudinary = require('cloudinary').v2;
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// User signup with image upload and OTP verification
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      confirmPassword,
      role,
      // otp,
    } = req.body;

    if (!firstName || !lastName || !username || !email || !phone || !password || !confirmPassword || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Handle image upload to Cloudinary
    // let uploadedImage;
    // if (image) {
    //   try {
    //     uploadedImage = await cloudinary.uploader.upload(image, {
    //       folder: 'user_profiles',
    //       resource_type: 'image',
    //     });
    //   } catch (uploadError) {
    //     console.error(uploadError);
    //     return res.status(500).json({ success: false, message: 'Image upload failed' });
    //   }
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      phone,
      password: hashedPassword,
      role,
      // otp
      // image: uploadedImage ? uploadedImage.secure_url : '',
    });

    return res.status(200).json({ success: true, user, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'User registration failed' });
  }
};

// Google sign-up
exports.googleSignup = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        email,
        username: email,
        role: 'user',
        image: picture,
      });
    }

    return res.status(200).json({ success: true, user, message: 'User signed up with Google successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Google sign-up failed' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not registered' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie('token', token, options);
    user.password = undefined;
    user.token=token;
    return res.status(200).json({ success: true, user, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again' });
  }
};

// Send OTP for email verification
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'User is already registered',
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false });
      result = await OTP.findOne({ otp });
    }

    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'The password is incorrect' });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        'Password for your account has been updated',
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log('Email sent successfully:', emailResponse.response);
    } catch (error) {
      console.error('Error occurred while sending email:', error);
      return res.status(500).json({
        success: false,
        message: 'Error occurred while sending email',
        error: error.message,
      });
    }

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error occurred while updating password:', error);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while updating password',
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
};