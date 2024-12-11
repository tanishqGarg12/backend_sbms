const express = require("express");
const app = express();
const userRoutes = require("./routers/User");
const inventoryRoutes = require("./routers/inventory");
const invoiceRoutes = require("./routers/invoice");
const testimonialRoutes = require("./routers/testimonialRoutes"); 
const cartRoutes = require("./routers/cart");
const categoryRoutes = require("./routers/categorySubcategoryRoutes");
const paymentRoutes = require("./routers/paymentRoutes");
const database = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// const upload=require('./uploads')
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, './uploads')));


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
app.use(bodyParser.urlencoded({ extended: true }));

const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

console.log(process.env.RAZORPAY_API_KEY);
console.log(process.env.RAZORPAY_API_SECRET);

// Use the Razorpay instance within relevant routes or controllers
// module.exports = instance;

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/testimonial", testimonialRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/categoryy", categoryRoutes);
app.use("/api/v1/pay", paymentRoutes);

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