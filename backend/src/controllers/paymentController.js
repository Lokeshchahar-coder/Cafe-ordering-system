const { getRazorpayClient } = require("../utils/razorpayClient");

async function createPaymentOrder(req, res, next) {
  try {
    const client = getRazorpayClient();
    if (!client) {
      return res.status(400).json({ message: "Razorpay keys are missing" });
    }

    const { amount } = req.body || {};
    if (!amount) {
      return res.status(400).json({ message: "amount is required" });
    }

    const order = await client.orders.create({
      amount: Number(amount),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

module.exports = { createPaymentOrder };
