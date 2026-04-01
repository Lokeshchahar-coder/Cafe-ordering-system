const { validateEnv } = require("./config/env");
const { connectDB } = require("./config/db");
const app = require("./app");

async function startServer() {
  try {
    validateEnv();
    console.log("[DEBUG] Connecting to MongoDB...");
    await connectDB(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const port = Number(process.env.PORT) || 8001;
    const host = process.env.HOST || "0.0.0.0";
    console.log("[DEBUG] Starting listener on port", port);
    app.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
