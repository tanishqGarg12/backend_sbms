const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
     image: {
        type: String,
        required:true,
    },
    otp: {
		type: String,
		required: true,
	},
   
    token:{
        type:String,
    },
    resetPasswordExpires:{
type:Date,
    },
});

module.exports = mongoose.model('User', UserSchema);