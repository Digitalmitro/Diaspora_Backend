import JobSeekerProfile from '../model/jobSeekerProfileModel.js';
import Experience from '../model/experienceModel.js';
import { ApplicationModel } from '../model/applicationModel.js';
import { SavedJobModel } from '../model/savedJobModel.js';
import { JobAlertModel } from '../model/jobAlertModel.js';
import { JobModel } from '../model/jobModel.js';
import dbService from '../services/dbServices.js';
import { uploadFile, deleteFile } from '../utils/fileUploadUtils.js';
import { catchAsync } from '../utils/catchAsyncUtils.js';
import ErrorResponse from '../utils/ErrorResponseUtils.js';
import { apiSuccessResponse } from '../utils/apiResponseUtils.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { calculateSkillsMatch } = require('../utils/skillsMatcherUtils.js');

const getProfile = catchAsync(async (req, res, next) => {
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id })
        .populate('experiences');

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    console.log('Profile resume data:', profile.resume);
    console.log('Profile experiences count:', profile.experiences?.length);

    return apiSuccessResponse(
        res,
        'Profile retrieved successfully',
        profile
    );
});

const updateProfile = catchAsync(async (req, res, next) => {
    const allowedFields = [
        'fullName',
        'phone',
        'preferredLocations',
        'bio',
        'profilePicture'
    ];

    const updates = {};
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    Object.assign(profile, updates);
    await profile.save();

    return apiSuccessResponse(
        res,
        'Profile updated successfully',
        profile
    );
});

const uploadResume = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    console.log('Upload file data:', req.file);

    const fileData = await uploadFile(req.file);
    console.log('Cloudinary upload result:', fileData);

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    if (profile.resume && profile.resume.path) {
        await deleteFile(profile.resume.path);
    }

    profile.resume = {
        url: fileData.url,
        path: fileData.path,
        filename: fileData.filename,
        originalname: fileData.originalname,
        size: fileData.size,
        mimetype: fileData.mimetype,
        uploadedAt: new Date()
    };

    console.log('Saving resume to profile:', profile.resume);
    await profile.save();
    console.log('Profile saved successfully');

    return apiSuccessResponse(
        res,
        'Resume uploaded successfully',
        { 
            resume: profile.resume
        }
    );
});

const deleteResume = catchAsync(async (req, res, next) => {
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    if (!profile.resume || !profile.resume.path) {
        return next(new ErrorResponse('No resume found', 404));
    }

    await deleteFile(profile.resume.path);
    profile.resume = undefined;
    await profile.save();

    return apiSuccessResponse(res, 'Resume deleted successfully', null);
});

const addSkill = catchAsync(async (req, res, next) => {
    const { skills } = req.body;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    const newSkills = skills.filter(skill => !profile.skills.includes(skill));
    profile.skills.push(...newSkills);

    await profile.save();

    return apiSuccessResponse(
        res,
        'Skills added successfully',
        { skills: profile.skills }
    );
});

const addExperience = catchAsync(async (req, res, next) => {
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    const experienceData = {
        ...req.body,
        jobSeekerId: profile._id
    };

    const experience = await dbService.createDocument(Experience, experienceData);

    profile.experiences.push(experience._id);
    await profile.save();

    return apiSuccessResponse(
        res,
        'Experience added successfully',
        experience,
        201
    );
});

const addEducation = catchAsync(async (req, res, next) => {
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    profile.education.push(req.body);
    await profile.save();

    return apiSuccessResponse(
        res,
        'Education added successfully',
        profile.education[profile.education.length - 1],
        201
    );
});

const updateExperience = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    const experience = await Experience.findOne({
        _id: id,
        jobSeekerId: profile._id
    });

    if (!experience) {
        return next(new ErrorResponse('Experience not found', 404));
    }

    const updatedExperience = await dbService.updateById(
        Experience,
        id,
        req.body
    );

    return apiSuccessResponse(
        res,
        'Experience updated successfully',
        updatedExperience
    );
});

const deleteExperience = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    const experience = await Experience.findOne({
        _id: id,
        jobSeekerId: profile._id
    });

    if (!experience) {
        return next(new ErrorResponse('Experience not found', 404));
    }

    await dbService.deleteById(Experience, id, false);

    profile.experiences = profile.experiences.filter(
        exp => exp.toString() !== id
    );
    await profile.save();

    return apiSuccessResponse(res, 'Experience deleted successfully', null);
});

const updateEducation = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    const educationIndex = profile.education.findIndex(
        edu => edu._id.toString() === id
    );

    if (educationIndex === -1) {
        return next(new ErrorResponse('Education not found', 404));
    }

    const allowedFields = ['degree', 'institution', 'fieldOfStudy', 'startDate', 'endDate', 'currentlyStudying', 'grade'];
    
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            profile.education[educationIndex][field] = req.body[field];
        }
    });

    await profile.save();

    return apiSuccessResponse(
        res,
        'Education updated successfully',
        profile.education[educationIndex]
    );
});

const deleteEducation = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    const educationIndex = profile.education.findIndex(
        edu => edu._id.toString() === id
    );

    if (educationIndex === -1) {
        return next(new ErrorResponse('Education not found', 404));
    }

    profile.education.splice(educationIndex, 1);
    await profile.save();

    return apiSuccessResponse(res, 'Education deleted successfully', null);
});

const getDashboardStats = catchAsync(async (req, res, next) => {
    const jobSeekerId = req.user._id;

    const profile = await JobSeekerProfile.findOne({ userId: jobSeekerId });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    let completionScore = 0;
    const totalFields = 7;
    
    if (profile.fullName) completionScore++;
    if (profile.phone) completionScore++;
    if (profile.bio) completionScore++;
    if (profile.resume?.url) completionScore++;
    if (profile.skills && profile.skills.length > 0) completionScore++;
    if (profile.experiences && profile.experiences.length > 0) completionScore++;
    if (profile.education && profile.education.length > 0) completionScore++;
    
    const profileCompletion = Math.round((completionScore / totalFields) * 100);

    const [
        totalApplications,
        activeApplications,
        shortlistedApplications,
        interviewingApplications,
        savedJobsCount,
        jobAlertsCount,
        recentApplications
    ] = await Promise.all([
        ApplicationModel.countDocuments({ jobSeekerId, isDeleted: false }),
        ApplicationModel.countDocuments({ 
            jobSeekerId, 
            status: { $in: ['applied', 'shortlisted', 'interviewed'] },
            isDeleted: false 
        }),
        ApplicationModel.countDocuments({ jobSeekerId, status: 'shortlisted', isDeleted: false }),
        ApplicationModel.countDocuments({ jobSeekerId, status: 'interviewed', isDeleted: false }),
        SavedJobModel.countDocuments({ jobSeekerId, isDeleted: false }),
        JobAlertModel.countDocuments({ jobSeekerId, isDeleted: false }),
        ApplicationModel.find({ jobSeekerId, isDeleted: false })
            .populate('jobId', 'title department location status')
            .sort({ appliedAt: -1 })
            .limit(5)
    ]);

    return apiSuccessResponse(res, 'Dashboard stats retrieved successfully', {
        stats: {
            totalApplications,
            activeApplications,
            shortlistedApplications,
            interviewsScheduled: interviewingApplications,
            savedJobs: savedJobsCount,
            jobAlerts: jobAlertsCount,
            profileCompletion
        },
        recentApplications
    });
});

const getRecommendedJobs = catchAsync(async (req, res, next) => {
    const jobSeekerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const profile = await JobSeekerProfile.findOne({ userId: jobSeekerId });

    if (!profile) {
        return next(new ErrorResponse('JobSeekerProfile not found', 404));
    }

    const query = { status: 'active', isDeleted: false };

    if (profile.skills && profile.skills.length > 0) {
        query['skills.name'] = { 
            $in: profile.skills.map(s => new RegExp(s, 'i')) 
        };
    }

    if (profile.preferredLocations && profile.preferredLocations.length > 0) {
        query.$or = [
            { location: { $in: profile.preferredLocations.map(loc => new RegExp(loc, 'i')) } },
            { isRemote: true }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appliedJobIds = await ApplicationModel.find({ 
        jobSeekerId, 
        isDeleted: false 
    }).distinct('jobId');

    query._id = { $nin: appliedJobIds };

    const [jobs, total] = await Promise.all([
        JobModel.find(query)
            .select('title department description location isRemote experienceRequired skills education salary jobType openings isFeatured createdAt')
            .populate('employerId', 'name')
            .sort({ isFeatured: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        JobModel.countDocuments(query)
    ]);

    const jobsWithMatch = jobs.map(job => {
        const jobSkills = job.skills?.map(s => s.name) || [];
        const candidateSkills = profile.skills || [];
        const matchResult = calculateSkillsMatch(jobSkills, candidateSkills);

        return {
            ...job.toObject(),
            skillsMatchPercentage: matchResult.matchPercentage || 0,
            matchedSkills: matchResult.matchedSkills || [],
            missingSkills: matchResult.missingSkills || []
        };
    });

    jobsWithMatch.sort((a, b) => b.skillsMatchPercentage - a.skillsMatchPercentage);

    return apiSuccessResponse(res, 'Recommended jobs retrieved successfully', {
        jobs: jobsWithMatch,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});

export {
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
};
