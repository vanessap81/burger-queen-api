const Products = require('../models/Products');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      type,
    } = req.body;

    if (!name || !price || !type) {
      return res.status(400).json({ error: 'Fields name, price and type are required' });
    }

    const product = new Products({
      name,
      price,
      image,
      type,
    });

    const newProduct = await product.save();
    res.status(201).json({ newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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
  createProduct,
};
