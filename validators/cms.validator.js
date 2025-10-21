import { body, param, validationResult } from "express-validator";

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

export const createPageValidation = [
    body("slug")
        .trim()
        .notEmpty()
        .withMessage("Slug is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Slug must be between 2 and 100 characters")
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug can only contain lowercase letters, numbers, and hyphens"),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Title must be between 2 and 200 characters"),

    body("content")
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage("Content must be at least 10 characters long"),

    body("home.bannerSection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Banner title must not exceed 200 characters"),

    body("home.jobCategorySection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Job category section title must not exceed 200 characters"),

    body("home.jobCategorySection.description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Job category section description must not exceed 500 characters"),

    body("home.blogSection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Blog section title must not exceed 200 characters"),

    body("home.blogSection.description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Blog section description must not exceed 500 characters"),

    body("home.jobsSection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Jobs section title must not exceed 200 characters"),

    body("home.jobsSection.description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Jobs section description must not exceed 500 characters"),

    body("home.secondBannerSection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Second banner section title must not exceed 200 characters"),

    body("home.secondBannerSection.description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Second banner section description must not exceed 500 characters"),

    handleValidationErrors,
];

export const updatePageValidation = [
    param("slug")
        .trim()
        .notEmpty()
        .withMessage("Slug parameter is required")
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug can only contain lowercase letters, numbers, and hyphens"),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Title must be between 2 and 200 characters"),

    body("content")
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage("Content must be at least 10 characters long"),

    body("home.bannerSection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Banner title must not exceed 200 characters"),

    body("home.jobCategorySection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Job category section title must not exceed 200 characters"),

    body("home.jobCategorySection.description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Job category section description must not exceed 500 characters"),

    body("home.blogSection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Blog section title must not exceed 200 characters"),

    body("home.blogSection.description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Blog section description must not exceed 500 characters"),

    body("home.jobsSection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Jobs section title must not exceed 200 characters"),

    body("home.jobsSection.description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Jobs section description must not exceed 500 characters"),

    body("home.secondBannerSection.title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Second banner section title must not exceed 200 characters"),

    body("home.secondBannerSection.description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Second banner section description must not exceed 500 characters"),

    handleValidationErrors,
];

export const getPageValidation = [
    param("slug")
        .trim()
        .notEmpty()
        .withMessage("Slug parameter is required")
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug can only contain lowercase letters, numbers, and hyphens"),

    handleValidationErrors,
];
