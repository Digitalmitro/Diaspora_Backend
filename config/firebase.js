import dotenv from "dotenv";
import admin from "firebase-admin";
import logger from "./logger.js";

dotenv.config();

try {
    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
    );

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
    });

    logger.info("Firebase Admin initialized successfully");
} catch (error) {
    logger.error("Firebase Admin initialization error:", error);
}

export default admin;
