import CMSPage from "../model/cmsModel.js";

class CMSService {
  async createPage(data) {
    return await CMSPage.create(data);
  }

  async updatePage(slug, data) {
    return await CMSPage.findOneAndUpdate({ slug }, data, { new: true });
  }

  async getPage(slug) {
    return await CMSPage.findOne({ slug });
  }

  async getAllPages() {
    return await CMSPage.find();
  }

}
export default new CMSService();
