import { body, param } from "express-validator";
import { handleValidationErrors } from "../middleware/errorHandlerMiddleware.js";

export const saveJobValidation = [
  body("jobId")
    .notEmpty()
    .withMessage("Job ID is required")
    .isMongoId()
    .withMessage("Invalid job ID format"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
  handleValidationErrors,
];

export const savedJobIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Saved job ID is required")
    .isMongoId()
    .withMessage("Invalid saved job ID format"),
  handleValidationErrors,
];

export const jobIdParamValidation = [
  param("jobId")
    .notEmpty()
    .withMessage("Job ID is required")
    .isMongoId()
    .withMessage("Invalid job ID format"),
  handleValidationErrors,
];
