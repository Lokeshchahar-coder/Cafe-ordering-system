async function login(req, res) {
  const { username, password, name } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Admin";

  const validUsername = String(username).trim() === adminUsername;
  const validPassword = String(password) === adminPassword;

  if (!validUsername || !validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (name && String(name).trim().length > 0 && String(name).trim() !== adminName) {
    return res.status(401).json({ message: "Invalid name for admin account" });
  }

  return res.json({
    message: "Login successful",
    token: "dev-admin-token",
    user: {
      name: adminName,
      username: adminUsername,
      role: "admin",
    },
  });
}

async function register(req, res) {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  return res.status(201).json({ message: "Register stub ready", name, email });
}

module.exports = { login, register };
