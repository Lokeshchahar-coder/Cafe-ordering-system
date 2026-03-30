require("dotenv").config();

const requiredVars = ["MONGO_URI"];

function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

module.exports = { validateEnv };
