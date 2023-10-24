const bcrypt = require('bcrypt');
const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: passwordHash,
      role,
    });

    await newUser.save();

    newUser.password = undefined;

    res.status(200).json({ newUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', erro: error });
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

module.exports = {
  getUsers,
  createUser,
};
