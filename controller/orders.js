const Orders = require('../models/Orders');

const getOrders = async (req, resp) => {
  try {
    const orders = await Orders.find();
    resp.json(orders);
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getOrders,
};
