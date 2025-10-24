import AuthService from "../services/authServices.js";
import UserMetadata from "../model/userMetadataModel.js";
import logger from "../config/logger.js";
import { catchAsync } from "../utils/catchAsyncUtils.js";
import { apiSuccessResponse, apiAuthSuccessResponse, HTTP_STATUS, HTTP_STATUS_MESSAGE } from "../utils/apiResponseUtils.js";
import { BadRequestException } from "../utils/ErrorResponseUtils.js";

class AuthController {
  register = catchAsync(async (req, res) => {
    const result = await AuthService.register(req.body, req.ip);
    logger.info("User registered successfully", { email: req.body.email, ip: req.ip });
    apiAuthSuccessResponse(res, result.message, result, HTTP_STATUS.CREATED);
  });

  login = catchAsync(async (req, res) => {
    const result = await AuthService.login(req.body, req.ip);
    logger.info("User logged in successfully", { email: req.body.email, ip: req.ip });
    apiAuthSuccessResponse(res, result.message, result, HTTP_STATUS.OK);
  });

  verifyEmail = catchAsync(async (req, res) => {
    const { token } = req.body;
    if (!token) throw new BadRequestException("Verification token is required");
    const result = await AuthService.verifyEmail(token, req.ip);
    logger.info("Email verified successfully", { ip: req.ip });
    apiSuccessResponse(res, HTTP_STATUS_MESSAGE[HTTP_STATUS.OK], result, HTTP_STATUS.OK);
  });

  forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new BadRequestException("Email is required");
    const result = await AuthService.forgotPassword(email, req.ip);
    logger.info("Password reset email sent", { email: req.body.email, ip: req.ip });
    apiSuccessResponse(res, HTTP_STATUS_MESSAGE[HTTP_STATUS.OK], result, HTTP_STATUS.OK);
  });

  resetPassword = catchAsync(async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) throw new BadRequestException("Token and password are required");
    const result = await AuthService.resetPassword(token, password, req.ip);
    logger.info("Password reset successfully", { ip: req.ip });
    apiSuccessResponse(res, HTTP_STATUS_MESSAGE[HTTP_STATUS.OK], result, HTTP_STATUS.OK);
  });

  logout = catchAsync(async (req, res) => {
    const userMetadata = await UserMetadata.findOne({ userId: req.user._id });
    if (userMetadata) {
      userMetadata.isOnline = false;
      await userMetadata.save();
    }
    logger.info("User logout", { userId: req.user?._id, email: req.user?.email, ip: req.ip });
    apiSuccessResponse(res, "Logged out successfully", null, HTTP_STATUS.OK);
  });

  getCurrentUser = catchAsync(async (req, res) => {
    logger.info("Get current user", { userId: req.user._id, email: req.user.email });

    const userMetadata = await UserMetadata.findOne({ userId: req.user._id });

    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
      isActive: req.user.isActive,
      createdAt: req.user.createdAt,
      metadata: userMetadata ? {
        lastLoginAt: userMetadata.lastLoginAt,
        loginCount: userMetadata.loginCount,
        preferences: userMetadata.preferences,
      } : null,
    };
    apiSuccessResponse(res, HTTP_STATUS_MESSAGE[HTTP_STATUS.OK], userData, HTTP_STATUS.OK);
  });

  updateProfile = catchAsync(async (req, res) => {
    const { name, email } = req.body;
    const user = await AuthService.updateUserProfile(req.user._id, { name, email }, req.ip);
    
    logger.info("User profile updated", { userId: req.user._id, email: user.email });
    
    apiSuccessResponse(res, "Profile updated successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    }, HTTP_STATUS.OK);
  });
}

export default new AuthController();
