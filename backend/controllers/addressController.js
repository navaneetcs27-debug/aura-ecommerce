const Address = require("../models/Address");

// GET /api/addresses - Fetch all addresses for logged in user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message
    });
  }
};

// POST /api/addresses - Add a new address
const addAddress = async (req, res) => {
  try {
    const { fullName, phone, street, landmark, city, state, pincode, tag, isDefault } = req.body;

    if (!fullName || !phone || !street || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone, street, city, and pincode are required"
      });
    }

    const existingCount = await Address.countDocuments({ user: req.user.id });
    const shouldBeDefault = existingCount === 0 || Boolean(isDefault);

    if (shouldBeDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = await Address.create({
      user: req.user.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      landmark: landmark ? landmark.trim() : "",
      city: city.trim(),
      state: (state || "Maharashtra").trim(),
      pincode: pincode.trim(),
      tag: tag || "Home",
      isDefault: shouldBeDefault
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message
    });
  }
};

// PUT /api/addresses/:id - Update an address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, street, landmark, city, state, pincode, tag, isDefault } = req.body;

    const address = await Address.findOne({ _id: id, user: req.user.id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }

    if (fullName !== undefined) address.fullName = fullName.trim();
    if (phone !== undefined) address.phone = phone.trim();
    if (street !== undefined) address.street = street.trim();
    if (landmark !== undefined) address.landmark = landmark.trim();
    if (city !== undefined) address.city = city.trim();
    if (state !== undefined) address.state = state.trim();
    if (pincode !== undefined) address.pincode = pincode.trim();
    if (tag !== undefined) address.tag = tag;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message
    });
  }
};

// DELETE /api/addresses/:id - Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({ _id: id, user: req.user.id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // If deleted address was default, make another address default
    if (address.isDefault) {
      const remainingAddress = await Address.findOne({ user: req.user.id }).sort({ createdAt: -1 });
      if (remainingAddress) {
        remainingAddress.isDefault = true;
        await remainingAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message
    });
  }
};

// PATCH /api/addresses/:id/default - Set an address as default
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: req.user.id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    await Address.updateMany(
      { user: req.user.id },
      { $set: { isDefault: false } }
    );

    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: "Default address updated",
      address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to set default address",
      error: error.message
    });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
