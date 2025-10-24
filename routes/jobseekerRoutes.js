import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isJobSeeker } from '../middleware/roleCheckMiddleware.js';
import upload from '../config/multer.js';
import {
    getProfile,
    updateProfile,
    uploadResume,
    deleteResume,
    addSkill,
    addExperience,
    addEducation,
    updateExperience,
    deleteExperience,
    updateEducation,
    deleteEducation,
    getDashboardStats,
    getRecommendedJobs
} from '../controller/jobseekerController.js';
import {
    profileUpdateValidation,
    skillsValidation,
    experienceValidation,
    educationValidation,
    idParamValidation
} from '../validators/jobseekerValidator.js';

const router = Router();

router.use(protect);
router.use(isJobSeeker);

router.get('/dashboard/stats', getDashboardStats);

router.get('/recommended-jobs', getRecommendedJobs);

router.get('/profile', getProfile);

router.put('/profile', profileUpdateValidation, updateProfile);

router.post('/resume', upload.single('resume'), uploadResume);

router.delete('/resume', deleteResume);

router.post('/skills', skillsValidation, addSkill);

router.post('/experience', experienceValidation, addExperience);

router.post('/education', educationValidation, addEducation);

router.put('/experience/:id', idParamValidation, experienceValidation, updateExperience);

router.delete('/experience/:id', idParamValidation, deleteExperience);

router.put('/education/:id', idParamValidation, educationValidation, updateEducation);

router.delete('/education/:id', idParamValidation, deleteEducation);

export default router;
