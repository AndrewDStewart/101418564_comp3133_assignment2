const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const getUser = async (req) => {
  const token = req.headers.authorization || '';
  
  if (!token) return null;
  
  try {
    const tokenValue = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const requireAuth = (user) => {
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }
};

module.exports = {
  generateToken,
  getUser,
  requireAuth
};