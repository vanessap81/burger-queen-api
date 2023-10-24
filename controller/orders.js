const Orders = require('../models/Orders');

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      client,
      products,
      status,
    } = req.body;

    if (!userId || !products || !client) {
      return res.status(400).json({ error: 'Fields userId and products are required' });
    }

    const order = new Orders({
      userId,
      client,
      products,
      status,
    });

    const newOrder = await order.save();
    res.status(201).json({ newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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
  createOrder,
};
