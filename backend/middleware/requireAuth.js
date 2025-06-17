const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const requireAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = authorization.split(' ')[1];

    try {
      const { _id } = jwt.verify(token, process.env.SECRET);
      
      if (!_id) {
        return res.status(401).json({ error: 'Invalid token payload' });
      }

      console.log('Token received:', token); // Debug log
      console.log('User ID extracted from token:', _id); // Debug log

      const user = await User.findById(_id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = requireAuth;