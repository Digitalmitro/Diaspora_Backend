import User from "../model/authModel.js";
import UserMetadata from "../model/userMetadataModel.js";
import { verifyAuthToken } from "../utils/authUtils.js";
import logger from "../config/logger.js";

const protect = async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verifyAuthToken(token);

      req.user = await User.findById(decoded._id).select("-password");

      if (!req.user) {
        logger.warn("Authentication failed: User not found", {
          userId: decoded._id,
          ip: req.ip,
          path: req.path,
        });
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      logger.info("Authentication successful", {
        userId: req.user._id,
        email: req.user.email,
        role: req.user.role,
        ip: req.ip,
        path: req.path,
      });

      let userMetadata = await UserMetadata.findOne({ userId: req.user._id });
      if (!userMetadata) {
        userMetadata = await UserMetadata.create({ userId: req.user._id });
      }
      await userMetadata.updateActivity();

      next();

    } else {
      logger.warn("Authentication failed: No token provided", {
        ip: req.ip,
        path: req.path,
      });
      return res.status(401).json({ message: "Not authorized, no token" });
    }

  } catch (error) {
    logger.error("Authentication failed: Invalid token", {
      error: error.message,
      ip: req.ip,
      path: req.path,
    });
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verifyAuthToken(token);

      req.user = await User.findById(decoded._id).select("-password");

      if (req.user) {
        logger.info("Optional authentication successful", {
          userId: req.user._id,
          email: req.user.email,
          role: req.user.role,
          ip: req.ip,
          path: req.path,
        });

        let userMetadata = await UserMetadata.findOne({ userId: req.user._id });
        if (!userMetadata) {
          userMetadata = await UserMetadata.create({ userId: req.user._id });
        }
        await userMetadata.updateActivity();
      }
    }
  } catch (error) {
    logger.debug("Optional authentication: Invalid or missing token", {
      error: error.message,
      ip: req.ip,
      path: req.path,
    });
  }

  next();
};

export { protect, optionalAuth };