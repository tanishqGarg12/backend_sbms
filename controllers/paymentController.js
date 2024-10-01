const  Payment  = require("../models/paymentModel.js");
const crypto = require("crypto");
// const  instance  = require("../index.js");
const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});
const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  console.log("instance is"+instance)
  const order =await instance.orders.create(options);
  console.log("------------------")
  console.log(order)
  res.status(200).json({
    success: true,
    order,
  });
};
const paymentVerification = async (req, res) => {
  console.log("------------------------start")
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate body for signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Verifying Payment with body:", body);

    // Generate the expected signature using HMAC SHA256 and your Razorpay API Secret
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    // Compare the signatures
    const isAuthentic = expectedSignature === razorpay_signature;
    console.log(isAuthentic)
    if (isAuthentic) {
      // Save payment details in the database
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Redirect to a success page
      console.log("sucess")
      return res.status(200).json({
        success: true,
        message:"sucss"
      })
    } else {
      // Payment verification failed
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Correct export syntax for multiple functions
module.exports = { checkout, paymentVerification };
