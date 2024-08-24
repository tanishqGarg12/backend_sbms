const express = require("express");
const app = express();

const userRoutes = require("./routers/User");
const inventoryRoutes=require("./routers/inventory")
const invoiceRoutes=require("./routers/invoice")
const testimonialRoutes=require("./routers/testimonialRoutes") 
const database = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cloudinary = require('cloudinary').v2;

// Load environment variables from .env file
dotenv.config();

const PORT = 4000;

// Database connection
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

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

// // Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/testimonial", testimonialRoutes);

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