const MenuItem = require("../models/MenuItem");

async function getMenu(_req, res, next) {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
}

async function createMenuItem(req, res, next) {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

module.exports = { getMenu, createMenuItem };
