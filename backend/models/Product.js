const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    imageUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);