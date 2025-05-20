const { User } = require('../models');
const BaseController = require('./baseController');
const { generateToken } = require('../middleware/auth');

class AuthController extends BaseController {
  static async register(req, res) {
    await this.handleRequest(req, res, async () => {
      const { firstName, lastName, secondName, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email }
      });

      if (existingUser) {
        throw this.handleValidationError({
          errors: [{
            path: 'email',
            message: 'User with this email already exists'
          }]
        });
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        fullName: `${firstName} ${lastName}${secondName ? ` ${secondName}` : ''}`
      });

      // Generate token
      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName,
          lastName,
          secondName,
          fullName: user.fullName
        }
      };
    });
  }

  static async login(req, res) {
    await this.handleRequest(req, res, async () => {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        throw this.handleUnauthorizedError('Invalid credentials');
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw this.handleUnauthorizedError('Invalid credentials');
      }

      // Generate token
      const token = generateToken(user);

      // Split fullName into components
      const nameParts = user.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[1];
      const secondName = nameParts.length > 2 ? nameParts[2] : null;

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName,
          lastName,
          secondName,
          fullName: user.fullName
        }
      };
    });
  }

  static async getProfile(req, res) {
    await this.handleRequest(req, res, async () => {
      const user = await UserProfile.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'fullName', 'createdAt', 'updatedAt'],
        include: [{
          model: Worker,
          as: 'workerProfile',
          include: [
            { model: Department, as: 'department' },
            { model: Position, as: 'position' }
          ]
        }]
      });

      if (!user) {
        throw this.handleNotFoundError('User not found');
      }

      return user;
    });
  }

  static async updateProfile(req, res) {
    await this.handleRequest(req, res, async () => {
      const { fullName, email, currentPassword, newPassword } = req.body;
      const user = await UserProfile.findByPk(req.user.id);

      if (!user) {
        throw this.handleNotFoundError('User not found');
      }

      // Update basic info
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;

      // Update password if provided
      if (currentPassword && newPassword) {
        const isValidPassword = await user.validatePassword(currentPassword);
        if (!isValidPassword) {
          throw this.handleUnauthorizedError('Current password is incorrect');
        }
        user.passwordHash = newPassword;
      }

      await user.save();

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      };
    });
  }
}

module.exports = AuthController; 