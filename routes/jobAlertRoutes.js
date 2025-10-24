import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isJobSeeker } from '../middleware/roleCheckMiddleware.js';
import {
    getJobAlerts,
    getJobAlertById,
    createJobAlert,
    updateJobAlert,
    deleteJobAlert,
    getMatchingJobsForAlert
} from '../controller/jobAlertController.js';
import {
    createJobAlertValidation,
    updateJobAlertValidation,
    jobAlertIdValidation
} from '../validators/jobAlertValidator.js';

const router = Router();

router.use(protect);
router.use(isJobSeeker);

router.get('/', getJobAlerts);

router.post('/', createJobAlertValidation, createJobAlert);

router.get('/:id', jobAlertIdValidation, getJobAlertById);

router.put('/:id', updateJobAlertValidation, updateJobAlert);

router.delete('/:id', jobAlertIdValidation, deleteJobAlert);

router.get('/:id/matching-jobs', jobAlertIdValidation, getMatchingJobsForAlert);

export default router;
