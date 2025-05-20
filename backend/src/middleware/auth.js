const jwt = require('jsonwebtoken');
const { User } = require('../models');
const BaseController = require('../controllers/baseController');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw BaseController.handleUnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw BaseController.handleUnauthorizedError('User not found');
    }

    // Split fullName into components
    const nameParts = user.fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[1];
    const secondName = nameParts.length > 2 ? nameParts[2] : null;

    // Attach user with parsed name components
    req.user = {
      ...user.toJSON(),
      firstName,
      lastName,
      secondName
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(BaseController.handleUnauthorizedError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(BaseController.handleUnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authMiddleware,
  generateToken
}; 