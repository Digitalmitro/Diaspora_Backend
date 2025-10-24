import JobSeekerProfile from '../model/jobSeekerProfileModel.js';
import Experience from '../model/experienceModel.js';
import dbService from '../services/dbServices.js';
import { uploadFile, deleteFile } from '../utils/fileUploadUtils.js';
import { catchAsync } from '../utils/catchAsyncUtils.js';
import ErrorResponse from '../utils/ErrorResponseUtils.js';
import { apiSuccessResponse } from '../utils/apiResponseUtils.js';

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

export {
    getProfile,
    updateProfile,
    uploadResume,
    deleteResume,
    addSkill,
    addExperience,
    addEducation,
    updateExperience,
    deleteExperience
};
