const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      allowNull: false,
    },
    price: {
      type: Number,
      allowNull: false,
    },
    image: {
      type: String,
    },
    type: {
      type: String,
    },
    dataEntry: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('products', productsSchema);
