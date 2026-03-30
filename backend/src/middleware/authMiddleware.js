function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7);
  req.user = { token };
  next();
}

module.exports = { authMiddleware };
