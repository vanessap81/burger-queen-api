const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { secret } = config;

const createUser = async (req, resp) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    if (!email || !password || !role) {
      return resp.status(400).json({ error: 'All fields are required' });
    }

    const data = {
      user: { email, password, role },
    };

    const passwordJwt = jwt.sign(data, secret);
    console.log(passwordJwt)

    const newUser = new User({
      email,
      password: passwordJwt,
      role,
    });

    await newUser.save();

    newUser.password = undefined;

    resp.status(200).json({ newUser });
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error', erro: error });
    console.log(error)
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

const deleteUser = async (req, resp) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return resp.status(404).json({ error: 'User not found' });
    }

    resp.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
};
