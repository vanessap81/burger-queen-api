const mongoose = require("mongoose");

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
        _id: {},
        productId: {
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
      enum: ["pending", "canceled", "delivering", "preparing", "delivered"],
      default: "pending",
    },
    dateEntry: {
      type: Date,
    },
    dateProcessed: {
      type: Date,
    },
    table: {
      type: String,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", ordersSchema);
