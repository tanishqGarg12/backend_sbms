const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Generate random token and send reset password email
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        // console.log("user is"+user)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        console.log("token"+token)

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();
        
        // Send email with nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log(process.env.EMAIL_USER)
        console.log(process.env.EMAIL_PASS)
        // console.log(transporter)
        console.log(user.email)
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.
            Please click on the following link to complete the process:
            ${process.env.CLIENT_URL}/reset-password/${token}`
        };
        console.log("before the ===========")
        console.log("mail option are"+mailOptions.to)
       transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error in sending email  ' + error);
      return true;
    } else {
     console.log('Email sent: ' + info.response);
     return false;
    }
   });
        console.log("afetr the transport=================")
        console.log('Password reset email sent successfully to', user.email);

        return res.status(200).json({ success: true, message: 'Reset email sent' });

    } catch (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).json({ success: false, message: 'Error sending email', error: error.message });
    }
};

// Reset password route
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
    }
};
