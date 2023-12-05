const Orders = require("../models/Orders");

const createOrder = async (req, resp) => {
  try {
    const { userId, client, products, status, table } = req.body;

    if (!userId || !products || !client || !table) {
      return resp
        .status(400)
        .json({ error: "Fields userId, products and client are required" });
    }

    const order = new Orders({
      userId,
      client,
      products,
      status,
      table,
    });

    const newOrder = await order.save();

    newOrder.products.forEach((product) => {
      product._id = undefined;
    });
    resp.status(201).json({ newOrder });
  } catch (error) {
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrderById = async (req, resp) => {
  try {
    const orderId = req.params.id;
    const order = await Orders.findById(orderId);

    if (!order) {
      resp.status(404).json({ error: "Order not found" });
    } else {
      order.products.forEach((product) => {
        product._id = undefined;
      });
      resp.json(order);
    }
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: "Order not found" });
    } else {
      resp.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const getOrders = async (req, resp) => {
  try {
    const orders = await Orders.find();
    orders.forEach((order) => {
      order.products.forEach((product) => {
        product._id = undefined;
      });
    });
    resp.json(orders);
  } catch (error) {
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

const updateOrder = async (req, resp) => {
  try {
    const orderId = req.params.id;
    const { userId, client, products, status, table } = req.body;
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      {
        userId,
        client,
        products,
        status,
        table,
      },
      { new: true }
    );

    if (!updatedOrder) {
      resp.status(404).json({ error: "Order not found" });
    } else {
      updatedOrder.products.forEach((product) => {
        product._id = undefined;
      });
      resp.json({ updatedOrder });
    }
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: "Order not found" });
    } else {
      resp.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const deleteOrder = async (req, resp) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Orders.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      resp.status(404).json({ error: "Order not found" });
    } else {
      resp.status(200).json({ message: "Successfully deleted" });
    }
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: "Order not found" });
    } else {
      resp.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
