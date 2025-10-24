import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDb from "./config/db.js";
import logger from "./config/logger.js";
import authRoutes from "./routes/authRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
import jobseekerRoutes from "./routes/jobseekerRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import jobAlertRoutes from "./routes/jobAlertRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandlerMiddleware.js";
import { generalRateLimiter } from "./middleware/rateLimitMiddleware.js";
import { httpsRedirect, securityHeaders } from "./middleware/securityMiddleware.js";

dotenv.config();
connectDb();

const app = express();

app.use(httpsRedirect);
app.use(securityHeaders);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://localhost:3001",
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With", 
    "Cache-Control", 
    "Pragma", 
    "Expires"
  ],
  exposedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(generalRateLimiter);

app.use("/auth", authRoutes);
app.use("/cms", cmsRoutes);
app.use("/seeker", jobseekerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/job-alerts", jobAlertRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true,
    message: "Welcome to Diaspora Server",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
