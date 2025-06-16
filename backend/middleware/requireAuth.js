const requireAuth = async (req, res, next) => {
  next();
};

module.exports = requireAuth;