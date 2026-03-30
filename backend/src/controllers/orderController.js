const Order = require("../models/Order");

async function createOrder(req, res, next) {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

async function getOrders(_req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

module.exports = { createOrder, getOrders };
