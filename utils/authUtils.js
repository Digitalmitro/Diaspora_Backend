import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AUTH } from "../config/constants.js";

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(AUTH.PASSWORD_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Password hashing failed");
  }
}; export const comparePassword = async (candidatePassword, hashedPassword) => {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

export const generateAuthToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || AUTH.JWT_EXPIRY_DAYS,
    }
  );
  return token;
};

export const verifyAuthToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
