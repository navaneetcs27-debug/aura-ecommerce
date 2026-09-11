const express = require("express");
const {
  getRazorpayKey,
  createPaymentOrder,
  verifyPaymentSignature
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/key", getRazorpayKey);
router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyPaymentSignature);

module.exports = router;
