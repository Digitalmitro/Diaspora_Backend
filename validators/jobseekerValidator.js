import { body, param, validationResult } from 'express-validator';
import ErrorResponse from '../utils/ErrorResponseUtils.js';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return next(new ErrorResponse(errorMessages.join(', '), 400));
    }
    next();
};

const profileUpdateValidation = [
    body('fullName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Full name cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Full name cannot exceed 100 characters'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Invalid phone number format'),

    body('preferredLocations')
        .optional()
        .isArray()
        .withMessage('Preferred locations must be an array'),

    body('preferredLocations.*')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Each location cannot exceed 100 characters'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),

    body('profilePicture')
        .optional()
        .trim()
        .custom((value) => {if (!value || value === '') {
                return true;
            }
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(value)) {
                throw new Error('Invalid profile picture URL');
            }
            return true;
        }),

    handleValidationErrors
];

const skillsValidation = [
    body('skills')
        .isArray({ min: 1 })
        .withMessage('Skills must be a non-empty array'),

    body('skills.*')
        .trim()
        .notEmpty()
        .withMessage('Each skill cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Each skill cannot exceed 50 characters'),

    handleValidationErrors
];

const experienceValidation = [
    body('jobTitle')
        .trim()
        .notEmpty()
        .withMessage('Job title is required')
        .isLength({ max: 100 })
        .withMessage('Job title cannot exceed 100 characters'),

    body('company')
        .trim()
        .notEmpty()
        .withMessage('Company name is required')
        .isLength({ max: 100 })
        .withMessage('Company name cannot exceed 100 characters'),

    body('location')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Location cannot exceed 100 characters'),

    body('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Invalid start date format'),

    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format')
        .custom((value, { req }) => {
            if (value && req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),

    body('currentlyWorking')
        .optional()
        .isBoolean()
        .withMessage('Currently working must be a boolean'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),

    handleValidationErrors
];

const educationValidation = [
    body('degree')
        .trim()
        .notEmpty()
        .withMessage('Degree is required')
        .isLength({ max: 100 })
        .withMessage('Degree cannot exceed 100 characters'),

    body('institution')
        .trim()
        .notEmpty()
        .withMessage('Institution is required')
        .isLength({ max: 100 })
        .withMessage('Institution cannot exceed 100 characters'),

    body('fieldOfStudy')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Field of study cannot exceed 100 characters'),

    body('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Invalid start date format'),

    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format')
        .custom((value, { req }) => {
            if (value && req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),

    body('currentlyStudying')
        .optional()
        .isBoolean()
        .withMessage('Currently studying must be a boolean'),

    body('grade')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Grade cannot exceed 50 characters'),

    handleValidationErrors
];

const idParamValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),

    handleValidationErrors
];

export {
    profileUpdateValidation,
    skillsValidation,
    experienceValidation,
    educationValidation,
    idParamValidation
};
