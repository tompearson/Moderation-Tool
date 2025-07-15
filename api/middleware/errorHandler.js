// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  // Default error
  let error = {
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.error = 'Validation error';
    error.details = err.message;
    return res.status(400).json(error);
  }

  if (err.name === 'UnauthorizedError') {
    error.error = 'Unauthorized';
    return res.status(401).json(error);
  }

  if (err.code === 'ENOENT') {
    error.error = 'Resource not found';
    return res.status(404).json(error);
  }

  // Send error response
  res.status(err.status || 500).json(error);
};

module.exports = errorHandler; 