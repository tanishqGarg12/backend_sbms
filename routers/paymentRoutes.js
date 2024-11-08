const express=require("express")
const {checkout, paymentVerification,getAllUsersWithPayments,getTotalAmount, getUserPayments}=require("../controllers/paymentController.js")


const router = express.Router();

router.route("/checkout").post(checkout);

router.route("/paymentverification").post(paymentVerification);
router.route("/getAllUserPayments").get(getAllUsersWithPayments)
router.route("/getTotall").get(getTotalAmount)
router.route("/getspe").get(getUserPayments)
module.exports = router;