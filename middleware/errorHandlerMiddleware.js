import { NotFoundException } from "../utils/ErrorResponse.js";
import logger from "../config/logger.js";

export const notFound = (req, res, next) => {
  next(new NotFoundException(`Not Found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  logger.error("Error occurred", {
    message: err.message,
    statusCode: err.statusCode || err.status || 500,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    status: statusCode,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
