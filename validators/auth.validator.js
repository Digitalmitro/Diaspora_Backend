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
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: AUTH.NAME_MIN_LENGTH, max: AUTH.NAME_MAX_LENGTH })
    .withMessage(`First name must be between ${AUTH.NAME_MIN_LENGTH} and ${AUTH.NAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: AUTH.NAME_MIN_LENGTH, max: AUTH.NAME_MAX_LENGTH })
    .withMessage(`Last name must be between ${AUTH.NAME_MIN_LENGTH} and ${AUTH.NAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: AUTH.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters long`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .custom((value, { req }) => {
      const allowedRoles = [USER_ROLE.JOB_SEEKER, USER_ROLE.EMPLOYER];
      if (req.user && req.user.role === USER_ROLE.ADMIN) {
        allowedRoles.push(USER_ROLE.ADMIN);
      }

      if (!allowedRoles.includes(value)) {
        throw new Error(
          req.user && req.user.role === USER_ROLE.ADMIN
            ? `Role must be ${USER_ROLE.JOB_SEEKER}, ${USER_ROLE.EMPLOYER}, or ${USER_ROLE.ADMIN}`
            : `Role must be either ${USER_ROLE.JOB_SEEKER} or ${USER_ROLE.EMPLOYER}`
        );
      }
      return true;
    }),

  handleValidationErrors,
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
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
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

export const resetPasswordValidation = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: AUTH.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters long`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  handleValidationErrors,
];

export const verifyEmailValidation = [
  body("token")
    .notEmpty()
    .withMessage("Verification token is required"),

  handleValidationErrors,
];
