import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Hash a password using bcryptjs
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Password hashing failed");
    }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} candidatePassword - Plain text password to compare
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
export const comparePassword = async (candidatePassword, hashedPassword) => {
    try {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
        throw new Error("Password comparison failed");
    }
};

/**
 * Generate JWT authentication token
 * @param {Object} user - User object containing _id, email, and role
 * @returns {string} - JWT token
 */
export const generateAuthToken = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET || "your-secret-key",
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
    return token;
};

/**
 * Verify JWT authentication token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
export const verifyAuthToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};
