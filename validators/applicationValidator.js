import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};

export const APPLICATION_STATUS = {
    APPLIED: "applied",
    SHORTLISTED: "shortlisted",
    REJECTED: "rejected",
    INTERVIEWED: "interviewed",
};

export const VALID_APPLICATION_STATUSES = Object.values(APPLICATION_STATUS);

export const SKILLS_MATCH_SCORE = {
    MIN: 0,
    MAX: 100,
};

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

export const createApplicationValidation = [
    body("jobId")
        .notEmpty()
        .withMessage("Job ID is required")
        .custom(isValidObjectId)
        .withMessage("Invalid Job ID format"),

    body("jobSeekerId")
        .notEmpty()
        .withMessage("Job Seeker ID is required")
        .custom(isValidObjectId)
        .withMessage("Invalid Job Seeker ID format"),

    body("resumeUrl")
        .notEmpty()
        .withMessage("Resume URL is required")
        .trim()
        .isURL()
        .withMessage("Resume URL must be a valid URL"),

    body("coverLetter")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Cover letter must not exceed 2000 characters"),

    body("status")
        .optional()
        .isIn(VALID_APPLICATION_STATUSES)
        .withMessage(
            `Status must be one of: ${VALID_APPLICATION_STATUSES.join(", ")}`
        ),

    body("skillsMatchScore")
        .optional()
        .isInt({ min: SKILLS_MATCH_SCORE.MIN, max: SKILLS_MATCH_SCORE.MAX })
        .withMessage(
            `Skills match score must be between ${SKILLS_MATCH_SCORE.MIN} and ${SKILLS_MATCH_SCORE.MAX}`
        ),

    handleValidationErrors,
];

export const updateApplicationValidation = [
    param("id")
        .notEmpty()
        .withMessage("Application ID is required")
        .custom(isValidObjectId)
        .withMessage("Invalid Application ID format"),

    body("resumeUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage("Resume URL must be a valid URL"),

    body("coverLetter")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Cover letter must not exceed 2000 characters"),

    body("status")
        .optional()
        .isIn(VALID_APPLICATION_STATUSES)
        .withMessage(
            `Status must be one of: ${VALID_APPLICATION_STATUSES.join(", ")}`
        ),

    body("skillsMatchScore")
        .optional()
        .isInt({ min: SKILLS_MATCH_SCORE.MIN, max: SKILLS_MATCH_SCORE.MAX })
        .withMessage(
            `Skills match score must be between ${SKILLS_MATCH_SCORE.MIN} and ${SKILLS_MATCH_SCORE.MAX}`
        ),

    handleValidationErrors,
];

export const updateApplicationStatusValidation = [
    param("id")
        .notEmpty()
        .withMessage("Application ID is required")
        .custom(isValidObjectId)
        .withMessage("Invalid Application ID format"),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(VALID_APPLICATION_STATUSES)
        .withMessage(
            `Status must be one of: ${VALID_APPLICATION_STATUSES.join(", ")}`
        ),

    handleValidationErrors,
];

export const getApplicationByIdValidation = [
    param("id")
        .notEmpty()
        .withMessage("Application ID is required")
        .custom(isValidObjectId)
        .withMessage("Invalid Application ID format"),

    handleValidationErrors,
];

export const getApplicationsByJobIdValidation = [
    param("jobId")
        .notEmpty()
        .withMessage("Job ID is required")
        .custom(isValidObjectId)
        .withMessage("Invalid Job ID format"),

    handleValidationErrors,
];

export const getApplicationsByJobSeekerIdValidation = [
    param("jobSeekerId")
        .notEmpty()
        .withMessage("Job Seeker ID is required")
        .custom(isValidObjectId)
        .withMessage("Invalid Job Seeker ID format"),

    handleValidationErrors,
];

export const deleteApplicationValidation = [
    param("id")
        .notEmpty()
        .withMessage("Application ID is required")
        .custom(isValidObjectId)
        .withMessage("Invalid Application ID format"),

    handleValidationErrors,
];
