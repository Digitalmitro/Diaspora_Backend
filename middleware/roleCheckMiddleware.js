import logger from "../config/logger.js";

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn("Role check failed: User not authenticated", {
        ip: req.ip,
        path: req.path,
      });
      return res.status(401).json({ message: "Not authorized, no user found" });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn("Role check failed: Insufficient permissions", {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
        ip: req.ip,
        path: req.path,
      });
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(", ")}`,
      });
    }

    logger.info("Role check passed", {
      userId: req.user._id,
      userRole: req.user.role,
      requiredRoles: roles,
      ip: req.ip,
      path: req.path,
    });

    next();
  };
};

export const isJobSeeker = checkRole("jobseeker");

export const isEmployer = checkRole("employer");

export const isAdmin = checkRole("admin");

export const isJobSeekerOrEmployer = checkRole("jobseeker", "employer");
