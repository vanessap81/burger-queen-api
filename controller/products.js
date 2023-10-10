const Products = require('../models/Products');

const getProducts = async (req, resp) => {
  try {
    const products = await Products.find();
    resp.json(products);
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getProducts,
};
