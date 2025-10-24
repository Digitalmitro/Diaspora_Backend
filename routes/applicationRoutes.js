import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isJobSeeker } from '../middleware/roleCheckMiddleware.js';
import {
    applyToJob,
    getMyApplications,
    getApplicationById,
    withdrawApplication
} from '../controller/applicationController.js';
import {
    createApplicationValidation,
    getApplicationByIdValidation,
    deleteApplicationValidation
} from '../validators/applicationValidator.js';

const router = Router();

router.use(protect);
router.use(isJobSeeker);

router.post('/', createApplicationValidation, applyToJob);

router.get('/', getMyApplications);

router.get('/:id', getApplicationByIdValidation, getApplicationById);

router.delete('/:id', deleteApplicationValidation, withdrawApplication);

export default router;
