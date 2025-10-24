import { body, validationResult } from "express-validator";
import { AUTH, USER_ROLE, VALID_USER_ROLES } from "../config/constants.js";

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

export const registerValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: AUTH.NAME_MIN_LENGTH, max: AUTH.NAME_MAX_LENGTH * 2 })
    .withMessage(`Name must be between ${AUTH.NAME_MIN_LENGTH} and ${AUTH.NAME_MAX_LENGTH * 2} characters`)
    .bail()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces")
    .customSanitizer((value, { req }) => {
      if (value && !req.body.fullName) {
        req.body.fullName = value;
      }
      return value;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: AUTH.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters long`)
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`]+$/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .bail()
    .toLowerCase()
    .custom((value, { req }) => {
      const allowedRoles = [USER_ROLE.JOB_SEEKER, USER_ROLE.EMPLOYER];
      if (req.user && req.user.role === USER_ROLE.ADMIN) {
        allowedRoles.push(USER_ROLE.ADMIN);
      }
      const roleMapping = {
        'seeker': USER_ROLE.JOB_SEEKER,
        'employer': USER_ROLE.EMPLOYER,
        'admin': USER_ROLE.ADMIN,
      };

      const normalizedRole = roleMapping[value.toLowerCase()] || value;

      if (!allowedRoles.includes(normalizedRole)) {
        throw new Error(
          req.user && req.user.role === USER_ROLE.ADMIN
            ? `Role must be 'seeker', 'employer', or 'admin'`
            : `Role must be either 'seeker' or 'employer'`
        );
      }
      req.body.role = normalizedRole;
      return true;
    }),

  handleValidationErrors,
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors,
];

export const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

export const resetPasswordValidation = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Reset token is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: AUTH.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters long`)
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`]+$/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
handleValidationErrors,
];

export const verifyEmailValidation = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Verification token is required"),

  handleValidationErrors,
];
