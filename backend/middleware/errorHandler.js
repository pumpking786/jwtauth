// errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    console.error("Error: ", err); // Log the error for debugging
    
    // Set the status code to 500 if not specified in the error object
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"; // Default error message
  
    res.status(statusCode).json({
      message: message,
      status: statusCode,
    });
  };
  
  module.exports = errorHandler;
  