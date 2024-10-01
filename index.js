const express = require("express");
const app = express();
const userRoutes = require("./routers/User");
const inventoryRoutes=require("./routers/inventory")
const invoiceRoutes=require("./routers/invoice")
const testimonialRoutes=require("./routers/testimonialRoutes") 
const cartRoutes=require("./routers/cart")
const CategiryRoutes=require("./routers/categorySubcategoryRoutes")
const paymentRoutes=require("./routers/paymentRoutes")
const database = require("./config/database");
const cors=require("cors")
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cloudinary = require('cloudinary').v2;

// Load environment variables from .env file
dotenv.config();

const PORT = 4000;

// Database connection
database.connect();

app.use(cors({
    origin: 'http://localhost:3000', // Your frontend domain
    credentials: true,
  }));
// Middlewares
app.use(express.json());
app.use(cookieParser());


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});
console.log(process.env.RAZORPAY_API_KEY)
console.log(process.env.RAZORPAY_API_SECRET)
module.exports = instance;

// // Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/testimonial", testimonialRoutes);
app.use("/api/v1/cart",cartRoutes)
app.use("/api/v1/categoryy",CategiryRoutes)
app.use("/api/v1/pay",paymentRoutes)

// Default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});