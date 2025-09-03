import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/signup", (req, res) => AuthController.signup(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));
router.get("/me", protect, (req, res) => AuthController.me(req, res));

export default router;
