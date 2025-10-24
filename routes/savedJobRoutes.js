import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isJobSeeker } from '../middleware/roleCheckMiddleware.js';
import {
    getSavedJobs,
    saveJob,
    unsaveJob,
    updateSavedJobNotes,
    checkIfJobSaved
} from '../controller/savedJobController.js';
import {
    saveJobValidation,
    savedJobIdValidation,
    jobIdParamValidation
} from '../validators/savedJobValidator.js';

const router = Router();

router.use(protect);
router.use(isJobSeeker);

router.get('/', getSavedJobs);

router.post('/', saveJobValidation, saveJob);

router.get('/check/:jobId', jobIdParamValidation, checkIfJobSaved);

router.delete('/:jobId', jobIdParamValidation, unsaveJob);

router.put('/:id/notes', savedJobIdValidation, updateSavedJobNotes);

export default router;
