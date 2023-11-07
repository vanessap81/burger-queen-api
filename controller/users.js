const bcrypt = require('bcrypt');
const User = require('../models/User');

const createUser = async (req, resp) => {
  try {
    const {
      email,
      name,
      password,
      role,
    } = req.body;

    if (!email || !password || !role || !name) {
      return resp.status(400).json({ error: 'All fields are required' });
    }

    const verifyEmail = await User.findOne({ email });

    if (!verifyEmail) {
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        name,
        password: passwordHash,
        role,
      });
      await newUser.save();
      newUser.password = undefined;

      resp.status(200).json({ newUser });
    } else {
      return resp.status(403).json({ error: 'Email already registered' });
    }
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserById = async (req, resp) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    resp.json(user);
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUsers = async (req, resp) => {
  try {
    const users = await User.find();
    resp.json(users);
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUser = async (req, resp) => {
  try {
    const userId = req.params.id;
    const { email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, passwordHash, role },
      { new: true },
    );

    if (!updatedUser) {
      return resp.status(404).json({ error: 'User not found' });
    }

    resp.json({ updatedUser });
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteUser = async (req, resp) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return resp.status(404).json({ error: 'User not found' });
    }

    resp.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    resp.status(500).json({ message: 'Internal Server Error', error });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
