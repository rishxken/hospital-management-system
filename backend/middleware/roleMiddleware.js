const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Admin bypasses all role checks
    if (req.user.role === 'admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    next();
  };
};

module.exports = { authorizeRoles };
