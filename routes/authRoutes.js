import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { authRateLimiter, strictRateLimiter, } from "../middleware/rateLimitMiddleware.js";
import { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, verifyEmailValidation, } from "../validators/authValidator.js";

const router = Router();

router.post("/signup", authRateLimiter, optionalAuth, registerValidation, AuthController.register);
router.post("/login", authRateLimiter, loginValidation, AuthController.login);
router.post("/verify-email", verifyEmailValidation, AuthController.verifyEmail);
router.post("/forgot-password", strictRateLimiter, forgotPasswordValidation, AuthController.forgotPassword);
router.post("/reset-password", strictRateLimiter, resetPasswordValidation, AuthController.resetPassword);

router.get("/me", protect, AuthController.getCurrentUser);
router.post("/logout", protect, AuthController.logout);
router.put("/update-profile", protect, AuthController.updateProfile);

export default router;
