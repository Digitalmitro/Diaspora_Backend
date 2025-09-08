import express from "express";
import cmsController from "../controller/cmsController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// Admin will use these
router.post(
  "/",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
  ]),
  cmsController.createPage
);
router.put("/:slug", cmsController.updatePage);

// Public or admin
router.get("/", cmsController.getAllPages);
router.get("/:slug", cmsController.getPage);

export default router;
