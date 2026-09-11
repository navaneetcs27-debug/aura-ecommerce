const express = require("express");
const {
  checkout,
  getMyOrders,
  getOrderById
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/checkout", checkout);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;