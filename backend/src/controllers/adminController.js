const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

async function getDashboardStats(_req, res, next) {
  try {
    const [menuCount, orderCount] = await Promise.all([
      MenuItem.countDocuments(),
      Order.countDocuments(),
    ]);

    res.json({ menuCount, orderCount });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboardStats };
