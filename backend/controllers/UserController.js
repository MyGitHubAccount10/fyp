const mongoose = require('mongoose');
const User = require('../models/UserModel');
const Order = require('../models/OrderModel'); // ✅ 1. Import the Order model
const OrderProduct = require('../models/OrderProductModel'); // ✅ 2. Import the Order-Product model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// ... (getUsers, getUser, createUser functions remain the same) ...
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});
    res.status(200).json(users);
}

const getUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findById(id);
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}

const createUser = async (req, res) => {
    const { 
        first_name, last_name, username, email, shipping_address,
        password, phone_number, role_id 
    } = req.body;
    try {
       const user = await User.signup(
            email, password, username, phone_number, role_id, 
            first_name, last_name, shipping_address
        );
       res.status(201).json(user);
    } catch (error) {
       res.status(400).json({error: error.message});
    }
}


// Admin-only delete function (for deleting OTHER users)
const deleteUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    // Note: A full implementation for this would also need to cascade delete orders.
    // We are focusing on the user self-delete for this request.
    const user = await User.findByIdAndDelete({_id: id});
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}


// --- ✅ 3. REWRITTEN FUNCTION WITH CASCADE DELETE & TRANSACTION ---
const deleteLoggedInUser = async (req, res) => {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user token.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Step 1: Find all orders associated with the user to get their IDs
        const userOrders = await Order.find({ user_id: userId }).session(session);
        const orderIdsToDelete = userOrders.map(order => order._id);

        // Step 2: If there are orders, delete all associated order-products
        if (orderIdsToDelete.length > 0) {
            await OrderProduct.deleteMany({ order_id: { $in: orderIdsToDelete } }).session(session);
        }

        // Step 3: Delete all orders belonging to the user
        await Order.deleteMany({ user_id: userId }).session(session);

        // Step 4: Delete the user account itself
        const deletedUser = await User.findByIdAndDelete(userId).session(session);

        if (!deletedUser) {
            // If the user wasn't found, something is wrong. Abort the transaction.
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'User not found.' });
        }

        // If all steps were successful, commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Account and all associated orders have been successfully deleted.' });

    } catch (error) {
        // If any error occurs at any step, abort the entire transaction
        await session.abortTransaction();
        session.endSession();
        console.error('Error during account deletion transaction:', error);
        res.status(500).json({ error: 'Server error while deleting account. The operation was cancelled.' });
    }
};
// --- ✅ END OF REWRITTEN FUNCTION ---


// ... (banUser, unbanUser, updateUser, loginUser, etc. all remain the same) ...

const banUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findByIdAndUpdate({_id: id}, {status: 'banned'}, {new: true});
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json({message: 'User banned successfully', user});
}

const unbanUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findByIdAndUpdate({_id: id}, {status: 'active'}, {new: true});
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json({message: 'User unbanned successfully', user});
}

const updateUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findOneAndUpdate({_id: id}, {...req.body});
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.login(email, password);
    const userWithRole = await User.findById(user._id).populate({ path: 'role_id', select: 'role_name' });
    const token = createToken(user._id);
    res.status(200).json({ 
        _id: userWithRole._id, email: userWithRole.email, username: userWithRole.username, 
        phone_number: userWithRole.phone_number, first_name: userWithRole.first_name, 
        last_name: userWithRole.last_name, shipping_address: userWithRole.shipping_address, 
        status: userWithRole.status,
        role: userWithRole.role_id, token 
    });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

const signupUser = async (req, res) => {
  const {email, password, username, phone_number, role_id, first_name, last_name, shipping_address} = req.body;
  try {
    const user = await User.signup(email, password, username, phone_number, role_id, first_name, last_name, shipping_address);
    const token = createToken(user._id);
    res.status(200).json({ 
        email: user.email, username: user.username, phone_number: user.phone_number, 
        first_name: user.first_name, last_name: user.last_name, 
        shipping_address: user.shipping_address, token 
    });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

const updateLoggedInUser = async (req, res) => {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(404).json({error: 'Invalid user ID'}); }
    const updateFields = {};
    if (req.body.first_name) updateFields.first_name = req.body.first_name;
    if (req.body.last_name) updateFields.last_name = req.body.last_name;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.phone_number) updateFields.phone_number = req.body.phone_number;
    if (req.body.shipping_address) updateFields.shipping_address = req.body.shipping_address;
    if (Object.keys(updateFields).length === 0) { return res.status(400).json({ error: 'No valid fields provided for update.' }); }
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true, runValidators: true });
        if (!updatedUser) { return res.status(404).json({error: 'User not found'}); }
        res.status(200).json({ 
            username: updatedUser.username, email: updatedUser.email, phone_number: updatedUser.phone_number,
            first_name: updatedUser.first_name, last_name: updatedUser.last_name, shipping_address: updatedUser.shipping_address,
        });
    } catch (error) {
        res.status(500).json({error: 'Failed to update user information: ' + error.message});
    }
};

const updateUserPassword = async (req, res) => {
    const userId = req.user._id;
    const { newPassword } = req.body;
    if (!newPassword) { return res.status(400).json({ error: 'New password is required.' }); }
    if (newPassword.length < 8) { return res.status(400).json({ error: 'Password must be at least 8 characters long.' }); }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        const updatedUser = await User.findByIdAndUpdate(userId, { password: hash });
        if (!updatedUser) { return res.status(404).json({ error: 'User not found' }); }
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Server error while updating password.' });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    banUser,
    unbanUser,
    updateUser,
    signupUser,
    loginUser,
    updateLoggedInUser,
    updateUserPassword,
    deleteLoggedInUser, // Function name is unchanged, but its logic is now transactional
};