const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true
    },
    landmark: {
      type: String,
      default: "",
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, "Postal code / PIN code is required"],
      trim: true
    },
    tag: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home"
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Address", addressSchema);
