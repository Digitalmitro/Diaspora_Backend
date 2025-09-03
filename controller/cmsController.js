import cmsService from "../services/cmsService.js";

class CMSController {
  async createPage(req, res) {
    try {
      const page = await cmsService.createPage(req.body);
      res.status(201).json(page);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updatePage(req, res) {
    try {
      const { slug } = req.params;
      const page = await cmsService.updatePage(slug, req.body);
      if (!page) return res.status(404).json({ message: "Page not found" });
      res.json(page);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getPage(req, res) {
    try {
      const { slug } = req.params;
      const page = await cmsService.getPage(slug);
      if (!page) return res.status(404).json({ message: "Page not found" });
      res.json(page);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAllPages(req, res) {
    try {
      const pages = await cmsService.getAllPages();
      res.json(pages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

}

export default new CMSController();
