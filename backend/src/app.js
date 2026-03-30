const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { authMiddleware } = require("./middleware/authMiddleware");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const envOrigin = process.env.FRONTEND_URL || "";
const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const privateNetworkPattern =
  /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (
        origin === envOrigin ||
        localhostPattern.test(origin) ||
        (process.env.NODE_ENV !== "production" && privateNetworkPattern.test(origin))
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(authMiddleware);

app.get("/", (_req, res) => {
  res.json({ message: "Tap2Order backend is running" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
