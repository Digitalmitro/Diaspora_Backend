import logger from "../config/logger.js";

export const httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    logger.warn("HTTP request in production, redirecting to HTTPS", {
      path: req.path,
      ip: req.ip,
    });
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
};

export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.removeHeader("X-Powered-By");
  next();
};
