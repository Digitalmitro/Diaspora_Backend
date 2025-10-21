import express from "express";
import cmsController from "../controller/cmsController.js";
import upload from "../middleware/upload.js";
import { createPageValidation, updatePageValidation, getPageValidation } from "../validators/cms.validator.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
    { name: "home[bannerSection][bannerImage]", maxCount: 1 },
    { name: "home[secondBannerSection][bannerImage]", maxCount: 1 },
  ]),
  createPageValidation,
  cmsController.createPage
);

router.put(
  "/:slug",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
    { name: "home[bannerSection][bannerImage]", maxCount: 1 },
    { name: "home[secondBannerSection][bannerImage]", maxCount: 1 },
  ]),
  updatePageValidation,
  cmsController.updatePage
);

router.get("/", cmsController.getAllPages);
router.get("/:slug", getPageValidation, cmsController.getPage);

export default router;
