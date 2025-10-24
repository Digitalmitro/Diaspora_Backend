import admin from "../config/firebase.js";
import User from "../model/authModel.js";
import UserMetadata from "../model/userMetadataModel.js";
import { verifyAuthToken } from "../utils/authUtils.js";
import logger from "../config/logger.js";

const extractToken = (req) => {
    if (req.headers.authorization?.startsWith("Bearer")) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};

const updateUserMetadata = async (userId) => {
    let userMetadata = await UserMetadata.findOne({ userId });
    if (!userMetadata) {
        userMetadata = await UserMetadata.create({ userId });
    }
    await userMetadata.updateActivity();
};

const verifyFirebaseToken = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            logger.warn("Firebase auth failed: No token", { ip: req.ip, path: req.path });
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await User.findOne({ email: decodedToken.email }).select("-password");

        if (!user) {
            logger.warn("Firebase auth: User not found", { firebaseUid: decodedToken.uid, ip: req.ip });
            return res.status(401).json({ message: "User not found in system" });
        }

        req.firebaseUser = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
            user,
        };

        logger.info("Firebase auth successful", { userId: user._id, role: user.role });
        await updateUserMetadata(user._id);
        next();
    } catch (error) {
        logger.error("Firebase auth failed", { error: error.message, ip: req.ip });
        return res.status(401).json({ message: "Not authorized, invalid Firebase token" });
    }
};

const hybridAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            logger.warn("Hybrid auth failed: No token", { ip: req.ip });
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            const user = await User.findOne({ email: decodedToken.email }).select("-password");

            if (user) {
                req.firebaseUser = {
                    uid: decodedToken.uid,
                    email: decodedToken.email,
                    emailVerified: decodedToken.email_verified,
                    user,
                };
                req.user = user;
                logger.info("Hybrid auth successful (Firebase)", { userId: user._id, role: user.role });
                await updateUserMetadata(user._id);
                return next();
            }
        } catch (firebaseError) {
            logger.debug("Firebase failed, trying JWT", { error: firebaseError.message });

            try {
                const decoded = verifyAuthToken(token);
                req.user = await User.findById(decoded._id).select("-password");

                if (!req.user) {
                    logger.warn("Hybrid auth failed: User not found", { userId: decoded._id });
                    return res.status(401).json({ message: "Not authorized, user not found" });
                }

                logger.info("Hybrid auth successful (JWT)", { userId: req.user._id, role: req.user.role });
                await updateUserMetadata(req.user._id);
                return next();
            } catch (jwtError) {
                logger.error("Both Firebase and JWT failed", { firebaseError: firebaseError.message, jwtError: jwtError.message });
                return res.status(401).json({ message: "Not authorized, invalid token" });
            }
        }

        return res.status(401).json({ message: "Authentication failed" });
    } catch (error) {
        logger.error("Hybrid auth error", { error: error.message });
        return res.status(401).json({ message: "Authentication failed" });
    }
};

const optionalFirebaseAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (token) {
            const decodedToken = await admin.auth().verifyIdToken(token);
            const user = await User.findOne({ email: decodedToken.email }).select("-password");

            if (user) {
                req.firebaseUser = {
                    uid: decodedToken.uid,
                    email: decodedToken.email,
                    emailVerified: decodedToken.email_verified,
                    user,
                };
                logger.info("Optional Firebase auth successful", { userId: user._id });
                await updateUserMetadata(user._id);
            }
        }
    } catch (error) {
        logger.debug("Optional Firebase auth: Invalid token", { error: error.message });
    }
    next();
};

export { verifyFirebaseToken, hybridAuth, optionalFirebaseAuth };
