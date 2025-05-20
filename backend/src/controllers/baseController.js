class BaseController {
  static async handleRequest(req, res, operation) {
    try {
      const result = await operation();
      res.json(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(error.status || 500).json({
        error: true,
        message: error.message || 'Internal server error'
      });
    }
  }

  static handleValidationError(error) {
    const err = new Error('Validation error');
    err.status = 400;
    err.errors = error.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    throw err;
  }

  static handleNotFoundError(message = 'Resource not found') {
    const error = new Error(message);
    error.status = 404;
    throw error;
  }

  static handleUnauthorizedError(message = 'Unauthorized access') {
    const error = new Error(message);
    error.status = 401;
    throw error;
  }

  static handleForbiddenError(message = 'Access forbidden') {
    const error = new Error(message);
    error.status = 403;
    throw error;
  }
}

module.exports = BaseController; 