const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const { secret } = config;

const login = async (req, resp) => {
  const {
    email,
    password,
    role,
  } = req.body;

  if (!email || !password || !role) {
    return resp.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return resp.status(404).json({ message: 'Not found' });
    }

    if (role !== user.role) {
      return resp.status(401).json({ message: 'Invalid role' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return resp.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, secret, { expiresIn: '1h' });

    resp.status(200).json({
      acessToken: token,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    resp.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login };
