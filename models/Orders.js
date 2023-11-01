const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      allowNull: false,
    },
    client: {
      type: String,
      allowNull: false,
    },
    products: [
      {
        id: {
          type: String,
          allowNull: false,
        },
        quantity: {
          type: Number,
          allowNull: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'canceled', 'delivering', 'delivered'],
      default: 'pending',
    },
    dateEntry: {
      type: Date,
    },
    dateProcessed: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('orders', ordersSchema);
