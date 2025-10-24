import cmsService from "../services/cmsServices.js";
import { catchAsync } from "../utils/catchAsyncUtils.js";
import { apiSuccessResponse, HTTP_STATUS, HTTP_STATUS_MESSAGE } from "../utils/apiResponseUtils.js";
import { NotFoundException, InternalServerException } from "../utils/ErrorResponseUtils.js";

class CMSController {
  createPage = catchAsync(async (req, res) => {
    const data = req.body;

    if (req.files?.banner) data.banner = req.files.banner[0].path;
    if (req.files?.secondaryImage) data.secondaryImage = req.files.secondaryImage[0].path;
    if (req.files?.['home[bannerSection][bannerImage]']) {
      data.home = data.home || {};
      data.home.bannerSection = data.home.bannerSection || {};
      data.home.bannerSection.bannerImage = req.files['home[bannerSection][bannerImage]'][0].path;
    }
    if (req.files?.['home[secondBannerSection][bannerImage]']) {
      data.home = data.home || {};
      data.home.secondBannerSection = data.home.secondBannerSection || {};
      data.home.secondBannerSection.bannerImage = req.files['home[secondBannerSection][bannerImage]'][0].path;
    }

    const page = await cmsService.createPage(data);
    if (!page) throw new InternalServerException("Failed to create page");
    apiSuccessResponse(res, HTTP_STATUS_MESSAGE[HTTP_STATUS.CREATED], page, HTTP_STATUS.CREATED);
  });

  updatePage = catchAsync(async (req, res) => {
    const { slug } = req.params;
    const data = req.body;
    const files = req.files;

    if (files?.banner) data.banner = files.banner[0];
    if (files?.secondaryImage) data.secondaryImage = files.secondaryImage[0];

    const page = await cmsService.updatePage(slug, data);
    if (!page) throw new NotFoundException("Page not found");
    apiSuccessResponse(res, HTTP_STATUS_MESSAGE[HTTP_STATUS.OK], page, HTTP_STATUS.OK);
  });

  getPage = catchAsync(async (req, res) => {
    const { slug } = req.params;
    const page = await cmsService.getPage(slug);
    if (!page) throw new NotFoundException("Page not found");
    apiSuccessResponse(res, HTTP_STATUS_MESSAGE[HTTP_STATUS.OK], page, HTTP_STATUS.OK);
  });

  getAllPages = catchAsync(async (_req, res) => {
    const pages = await cmsService.getAllPages();
    apiSuccessResponse(res, HTTP_STATUS_MESSAGE[HTTP_STATUS.OK], pages, HTTP_STATUS.OK);
  });
}

export default new CMSController();
