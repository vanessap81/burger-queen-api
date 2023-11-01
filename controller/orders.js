const Orders = require('../models/Orders');

const createOrder = async (req, resp) => {
  try {
    const {
      userId,
      client,
      products,
      status,
    } = req.body;

    if (!userId || !products || !client) {
      return resp.status(400).json({ error: 'Fields userId and products are required' });
    }

    const order = new Orders({
      userId,
      client,
      products,
      status,
    });

    const newOrder = await order.save();
    resp.status(201).json({ newOrder });
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrderById = async (req, resp) => {
  try {
    const orderId = req.params.id;
    const order = await Orders.findById(orderId);
    resp.json(order);
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
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

const updateOrder = async (req, resp) => {
  try {
    const orderId = req.params.id;
    const { email, password, role } = req.body;
    const updatedUser = await Orders.findByIdAndUpdate(
      orderId,
      { email, password, role },
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

const deleteOrder = async (req, resp) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Orders.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return resp.status(404).json({ error: 'Order not found' });
    }

    resp.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
