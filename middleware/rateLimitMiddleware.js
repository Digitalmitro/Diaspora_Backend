import rateLimit from "express-rate-limit";
import logger from "../config/logger.js";
import { RATE_LIMITS } from "../config/constants.js";

const skipRateLimitInTest = (req, res) => {
    return process.env.NODE_ENV === "test";
};

export const authRateLimiter = rateLimit({
    windowMs: RATE_LIMITS.AUTH_WINDOW_MS,
    max: RATE_LIMITS.AUTH_MAX_REQUESTS,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipRateLimitInTest,
    handler: (req, res) => {
        logger.warn("Rate limit exceeded for authentication", {
            ip: req.ip,
            path: req.path,
        });
        res.status(429).json({
            success: false,
            message: "Too many attempts. Please try again after 15 minutes.",
        });
    },
});

export const generalRateLimiter = rateLimit({
    windowMs: RATE_LIMITS.GENERAL_WINDOW_MS,
    max: RATE_LIMITS.GENERAL_MAX_REQUESTS,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipRateLimitInTest,
    handler: (req, res) => {
        logger.warn("Rate limit exceeded", {
            ip: req.ip,
            path: req.path,
        });
        res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    },
});

export const strictRateLimiter = rateLimit({
    windowMs: RATE_LIMITS.STRICT_WINDOW_MS,
    max: RATE_LIMITS.STRICT_MAX_REQUESTS,
    message: {
        success: false,
        message: "Too many password reset attempts. Please try again after 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    skip: skipRateLimitInTest,
    handler: (req, res) => {
        logger.warn("Strict rate limit exceeded", {
            ip: req.ip,
            path: req.path,
        });
        res.status(429).json({
            success: false,
            message: "Too many attempts. Please try again after 1 hour.",
        });
    },
});
