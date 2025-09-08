import cmsService from "../services/cmsService.js";

class CMSController {
  async createPage(req, res) {
    try {
        const data = req.body;
      if (req.files?.banner) {
        data.banner = req.files.banner[0].path; 
      }
      if (req.files?.secondaryImage) {
        data.secondaryImage = req.files.secondaryImage[0].path; 
      }
      const page = await cmsService.createPage(data);
      console.log(data)
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
