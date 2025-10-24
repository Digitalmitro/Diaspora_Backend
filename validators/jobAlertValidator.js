import { body, param } from "express-validator";
import { handleValidationErrors } from "../middleware/errorHandlerMiddleware.js";

export const createJobAlertValidation = [
  body("title")
    .notEmpty()
    .withMessage("Alert title is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must not exceed 100 characters"),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),
  body("jobType")
    .optional()
    .isArray()
    .withMessage("Job type must be an array")
    .custom((value) => {
      const validTypes = ["fulltime", "parttime", "internship", "contract"];
      return value.every((type) => validTypes.includes(type));
    })
    .withMessage("Invalid job type"),
  body("salaryMin")
    .optional()
    .isNumeric()
    .withMessage("Minimum salary must be a number")
    .custom((value) => value >= 0)
    .withMessage("Minimum salary must be non-negative"),
  body("frequency")
    .optional()
    .isIn(["daily", "weekly", "instant"])
    .withMessage("Frequency must be daily, weekly, or instant"),
  handleValidationErrors,
];

export const updateJobAlertValidation = [
  param("id")
    .notEmpty()
    .withMessage("Alert ID is required")
    .isMongoId()
    .withMessage("Invalid alert ID format"),
  ...createJobAlertValidation,
];

export const jobAlertIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Alert ID is required")
    .isMongoId()
    .withMessage("Invalid alert ID format"),
  handleValidationErrors,
];
