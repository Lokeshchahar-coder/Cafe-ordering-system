const Cart = require("../models/Cart");

async function getCart(req, res, next) {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate("items.menuItem");
    res.json(cart || { user: userId, items: [] });
  } catch (error) {
    next(error);
  }
}

async function upsertCart(req, res, next) {
  try {
    const { userId } = req.params;
    const { items = [] } = req.body || {};
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { user: userId, items },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

module.exports = { getCart, upsertCart };
