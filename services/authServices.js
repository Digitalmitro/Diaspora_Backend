import User from "../model/authModel.js";
import UserMetadata from "../model/userMetadataModel.js";
import { hashPassword, comparePassword, generateAuthToken } from "../utils/authUtils.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/sendEmailUtils.js";
import logger from "../config/logger.js";
import crypto from "crypto";

class AuthService {
  async register({ firstName, lastName, email, password, role }, ip) {
    const name = `${firstName} ${lastName}`;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("Registration failed: User already exists", { email, ip });
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    const userMetadata = await UserMetadata.create({
      userId: user._id,
    });

    await userMetadata.setVoidVariable('verificationToken', verificationToken);

    try {
      await sendVerificationEmail(email, verificationToken);
      logger.info("Verification email sent", { email, userId: user._id });
    } catch (emailError) {
      logger.error("Failed to send verification email", {
        email,
        userId: user._id,
        error: emailError.message,
      });
    }

    logger.info("User registered successfully", {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip,
    });

    return {
      message: "Registration successful! Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async login({ email, password }, ip) {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Login failed: User not found", { email, ip });
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      logger.warn("Login failed: Invalid password", {
        email,
        userId: user._id,
        ip,
      });
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      logger.warn("Login failed: Email not verified", {
        email,
        userId: user._id,
        ip,
      });
      const error = new Error("Please verify your email before logging in");
      error.statusCode = 403;
      throw error;
    }

    if (!user.isActive) {
      logger.warn("Login failed: Account inactive", {
        email,
        userId: user._id,
        ip,
      });
      const error = new Error("Your account has been deactivated");
      error.statusCode = 403;
      throw error;
    }

    const token = generateAuthToken(user);

    let userMetadata = await UserMetadata.findOne({ userId: user._id });
    if (!userMetadata) {
      userMetadata = await UserMetadata.create({ userId: user._id });
    }

    await userMetadata.recordLogin({
      ip,
    });

    logger.info("Login successful", {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip,
    });

    return {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async verifyEmail(token, ip) {
    const userMetadata = await UserMetadata.findByVoidVariable('verificationToken', token);

    if (!userMetadata) {
      logger.warn("Email verification failed: Invalid token", { ip });
      throw new Error("Invalid or expired verification token");
    }

    const user = await User.findById(userMetadata.userId);
    if (!user) {
      logger.warn("Email verification failed: User not found", { ip });
      throw new Error("Invalid or expired verification token");
    }

    if (user.isVerified) {
      logger.info("Email already verified", { email: user.email, userId: user._id });
      return {
        message: "Email is already verified. You can login now.",
        user: {
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
        },
      };
    }

    user.isVerified = true;
    await user.save();

    await userMetadata.deleteVoidVariable('verificationToken');

    logger.info("Email verified successfully", {
      userId: user._id,
      email: user.email,
      ip,
    });

    return {
      message: "Email verified successfully! You can now login to your account.",
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }

  async forgotPassword(email, ip) {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Forgot password: User not found", { email, ip });
      return {
        message: "If an account exists with this email, you will receive a password reset link.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000;

    let userMetadata = await UserMetadata.findOne({ userId: user._id });
    if (!userMetadata) {
      userMetadata = await UserMetadata.create({ userId: user._id });
    }

    await userMetadata.setVoidVariable('resetPasswordToken', resetToken);
    await userMetadata.setVoidVariable('resetPasswordTokenExpiry', tokenExpiry);

    try {
      await sendPasswordResetEmail(email, resetToken);
      logger.info("Password reset email sent", {
        email,
        userId: user._id,
        tokenExpiry: new Date(tokenExpiry).toISOString(),
      });
    } catch (emailError) {
      logger.error("Failed to send password reset email", {
        email,
        userId: user._id,
        error: emailError.message,
      });
      await userMetadata.deleteVoidVariable('resetPasswordToken');
      await userMetadata.deleteVoidVariable('resetPasswordTokenExpiry');
      throw new Error("Failed to send reset email");
    }

    return {
      message: "If an account exists with this email, you will receive a password reset link.",
    };
  }

  async resetPassword(token, password, ip) {
    const userMetadata = await UserMetadata.findByVoidVariable('resetPasswordToken', token);

    if (!userMetadata) {
      logger.warn("Reset password failed: Invalid token", { ip });
      throw new Error("Invalid or expired reset token");
    }

    const tokenExpiry = userMetadata.getVoidVariable('resetPasswordTokenExpiry');
    if (tokenExpiry && Date.now() > tokenExpiry) {
      logger.warn("Reset password failed: Token expired", { ip });
      await userMetadata.deleteVoidVariable('resetPasswordToken');
      await userMetadata.deleteVoidVariable('resetPasswordTokenExpiry');
      throw new Error("Invalid or expired reset token");
    }

    const user = await User.findById(userMetadata.userId);
    if (!user) {
      logger.warn("Reset password failed: User not found", { ip });
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    await user.save();

    await userMetadata.deleteVoidVariable('resetPasswordToken');
    await userMetadata.deleteVoidVariable('resetPasswordTokenExpiry');

    logger.info("Password reset successful", {
      userId: user._id,
      email: user.email,
      ip,
    });

    return {
      message: "Password reset successful! You can now login with your new password.",
    };
  }
}

export default new AuthService();
