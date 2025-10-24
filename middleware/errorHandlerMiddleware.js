import { NotFoundException } from "../utils/ErrorResponseUtils.js";
import logger from "../config/logger.js";
import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

export const notFound = (req, res, next) => {
  next(new NotFoundException(`Not Found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  if (statusCode !== 404) {
    console.error(err.stack);
    
    logger.error("Error occurred", {
      message: err.message,
      statusCode: statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
