import { body, validationResult } from "express-validator";

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

export const createJobValidation = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("isRemote").optional().isBoolean().withMessage("isRemote must be a boolean"),
  body("experienceRequired").isInt({ min: 0 }).withMessage("Experience required must be a non-negative integer"),
  body("skills").isArray({ min: 1 }).withMessage("At least one skill is required"),
  body("skills.*.name").trim().notEmpty().withMessage("Skill name is required"),
  body("skills.*.level").optional().isIn(["beginner", "intermediate", "advanced", "expert"]).withMessage("Invalid skill level"),
  body("skills.*.isRequired").optional().isBoolean().withMessage("isRequired must be a boolean"),
  body("education").trim().notEmpty().withMessage("Education requirement is required"),
  body("educationPreferences").optional().isObject().withMessage("Education preferences must be an object"),
  body("educationPreferences.minimumDegree")
    .optional()
    .isIn(["highschool", "diploma", "bachelor", "master", "phd"])
    .withMessage("Invalid minimum degree"),
  body("educationPreferences.preferredInstitutions")
    .optional()
    .isArray()
    .withMessage("Preferred institutions must be an array"),
  body("educationPreferences.preferredFieldsOfStudy")
    .optional()
    .isArray()
    .withMessage("Preferred fields of study must be an array"),
  body("educationPreferences.institutionType")
    .optional()
    .isIn(["any", "tier1", "tier2", "tier3", "iit", "nit", "iiit", "ivy_league", "top_universities"])
    .withMessage("Invalid institution type"),
  body("educationPreferences.isStrict")
    .optional()
    .isBoolean()
    .withMessage("isStrict must be a boolean"),
  body("salary.min").isFloat({ min: 0 }).withMessage("Minimum salary must be a non-negative number"),
  body("salary.max").isFloat({ min: 0 }).withMessage("Maximum salary must be a non-negative number"),
  body("salary.currency").optional().trim().notEmpty().withMessage("Currency is required if salary is provided"),
  body("jobType").isIn(["fulltime", "parttime", "internship", "contract"]).withMessage("Invalid job type"),
  body("openings").optional().isInt({ min: 1 }).withMessage("Openings must be at least 1"),
  body("perks").optional().isArray().withMessage("Perks must be an array"),
  body("perks.*.name").optional().trim().notEmpty().withMessage("Perk name is required"),
  body("expiresAt").optional().isISO8601().withMessage("Expires at must be a valid date"),
  handleValidationErrors,
];

export const updateJobValidation = [
  body("title").optional().trim().notEmpty().withMessage("Job title cannot be empty"),
  body("department").optional().trim().notEmpty().withMessage("Department cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("location").optional().trim().notEmpty().withMessage("Location cannot be empty"),
  body("isRemote").optional().isBoolean().withMessage("isRemote must be a boolean"),
  body("experienceRequired").optional().isInt({ min: 0 }).withMessage("Experience required must be a non-negative integer"),
  body("skills").optional().isArray({ min: 1 }).withMessage("At least one skill is required"),
  body("skills.*.name").optional().trim().notEmpty().withMessage("Skill name is required"),
  body("skills.*.level").optional().isIn(["beginner", "intermediate", "advanced", "expert"]).withMessage("Invalid skill level"),
  body("education").optional().trim().notEmpty().withMessage("Education requirement cannot be empty"),
  body("educationPreferences").optional().isObject().withMessage("Education preferences must be an object"),
  body("educationPreferences.minimumDegree")
    .optional()
    .isIn(["highschool", "diploma", "bachelor", "master", "phd"])
    .withMessage("Invalid minimum degree"),
  body("educationPreferences.preferredInstitutions")
    .optional()
    .isArray()
    .withMessage("Preferred institutions must be an array"),
  body("educationPreferences.preferredFieldsOfStudy")
    .optional()
    .isArray()
    .withMessage("Preferred fields of study must be an array"),
  body("educationPreferences.institutionType")
    .optional()
    .isIn(["any", "tier1", "tier2", "tier3", "iit", "nit", "iiit", "ivy_league", "top_universities"])
    .withMessage("Invalid institution type"),
  body("educationPreferences.isStrict")
    .optional()
    .isBoolean()
    .withMessage("isStrict must be a boolean"),
  body("salary.min").optional().isFloat({ min: 0 }).withMessage("Minimum salary must be a non-negative number"),
  body("salary.max").optional().isFloat({ min: 0 }).withMessage("Maximum salary must be a non-negative number"),
  body("jobType").optional().isIn(["fulltime", "parttime", "internship", "contract"]).withMessage("Invalid job type"),
  body("openings").optional().isInt({ min: 1 }).withMessage("Openings must be at least 1"),
  body("status").optional().isIn(["draft", "pending", "active", "closed", "rejected"]).withMessage("Invalid status"),
  body("expiresAt").optional().isISO8601().withMessage("Expires at must be a valid date"),
  handleValidationErrors,
];
