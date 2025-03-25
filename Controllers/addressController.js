import Address from "../Models/Address.js";

// Add a new address
export const addAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, country, type } = req.body;
    const userId = req.user.id;

    const address = new Address({ userId, street, city, state, postalCode, country, type });
    await address.save();

    res.status(201).json({ message: 'Address added successfully', address });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error: error.message });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, postalCode, country, type } = req.body;

    const updatedAddress = await Address.findByIdAndUpdate(id, { street, city, state, postalCode, country, type }, { new: true });

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address updated successfully', updatedAddress });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};