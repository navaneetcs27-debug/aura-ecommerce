const Cart = require("../models/Cart");
const Product = require("../models/Product");

const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price imageUrl"
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalPrice: 0 });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const parsedQuantity = Number(quantity);

    if (!productId || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "A valid productId and positive integer quantity are required"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);
    const nextQuantity = item ? item.quantity + parsedQuantity : parsedQuantity;

    if (nextQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available in stock`
      });
    }

    if (item) {
      item.quantity = nextQuantity;
      item.price = product.price;
    } else {
      cart.items.push({ product: product._id, quantity: parsedQuantity, price: product.price });
    }

    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();
    await cart.populate("items.product", "name price imageUrl");

    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();
    await cart.populate("items.product", "name price imageUrl");

    res.status(200).json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message
    });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
