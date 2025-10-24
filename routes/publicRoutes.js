import { Router } from 'express';
import {
    searchJobs,
    getJobById,
    getStats,
    getTestimonials,
    getPartners,
    getFAQs
} from '../controller/publicController.js';

const router = Router();

router.get('/jobs/search', searchJobs);

router.get('/jobs/:id', getJobById);

router.get('/stats', getStats);

router.get('/testimonials', getTestimonials);

router.get('/partners', getPartners);

router.get('/faqs', getFAQs);

export default router;
