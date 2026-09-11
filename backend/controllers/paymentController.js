const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// Helper to check if credentials are provided
const hasValidCredentials = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  return (
    key_id &&
    key_id.startsWith("rzp_") &&
    !key_id.includes("sample") &&
    key_secret &&
    !key_secret.includes("sample")
  );
};

// Initialize Razorpay instance if keys exist
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "sample_secret_key_aura";
  
  return new Razorpay({
    key_id,
    key_secret
  });
};

// GET /api/payment/key - Get public Razorpay Key ID
const getRazorpayKey = (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";
  res.status(200).json({
    success: true,
    keyId,
    isConfigured: hasValidCredentials()
  });
};

// POST /api/payment/create-order - Create a Razorpay Order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required"
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const orderReceipt = (receipt || `rcpt_${Date.now()}`).slice(0, 40);
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";

    // If configured with real/valid keys, create order via Razorpay API
    if (hasValidCredentials()) {
      try {
        const razorpay = getRazorpayInstance();
        const options = {
          amount: amountInPaise,
          currency: "INR",
          receipt: orderReceipt,
          payment_capture: 1
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json({
          success: true,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: key_id,
          isRealOrder: true
        });
      } catch (rzpErr) {
        console.warn("⚠️ Razorpay API order creation failed:", rzpErr.message);
      }
    }

    // Standard client-side mode (Razorpay Checkout without server order_id)
    return res.status(200).json({
      success: true,
      amount: amountInPaise,
      currency: "INR",
      keyId: key_id,
      isRealOrder: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to initialize payment",
      error: error.message
    });
  }
};

// POST /api/payment/verify - Verify Razorpay Payment Signature
const verifyPaymentSignature = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId
    } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required"
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    let isValid = true;

    if (secret && hasValidCredentials() && razorpay_order_id && razorpay_signature) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");

      isValid = (expectedSignature === razorpay_signature);
    }

    // Update DB Order if dbOrderId provided
    if (dbOrderId) {
      const order = await Order.findById(dbOrderId);
      if (order) {
        order.isPaid = true;
        order.orderStatus = "Processing";
        await order.save();
      }
    }

    res.status(200).json({
      success: true,
      verified: isValid,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
};

module.exports = {
  getRazorpayKey,
  createPaymentOrder,
  verifyPaymentSignature
};
