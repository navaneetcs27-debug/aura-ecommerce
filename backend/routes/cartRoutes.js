const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/item/:productId", removeFromCart);

module.exports = router;
