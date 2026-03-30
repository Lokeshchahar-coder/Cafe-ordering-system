const Order = require("../models/Order");

async function trackOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      orderId: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { trackOrder };
