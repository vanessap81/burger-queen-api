const bcrypt = require('bcrypt');
const User = require('../models/User');

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
};
