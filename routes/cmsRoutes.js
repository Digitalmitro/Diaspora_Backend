import express from "express";
import cmsController from "../controller/cmsController.js";

const router = express.Router();

// Admin will use these
router.post("/", cmsController.createPage);
router.put("/:slug", cmsController.updatePage);

// Public or admin
router.get("/", cmsController.getAllPages);
router.get("/:slug", cmsController.getPage);

export default router;
