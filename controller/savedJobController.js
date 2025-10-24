import { SavedJobModel } from "../model/savedJobModel.js";
import { JobModel } from "../model/jobModel.js";
import { apiSuccessResponse, apiErrorResponse, HTTP_STATUS } from "../utils/apiResponseUtils.js";
import { catchAsync } from "../utils/catchAsyncUtils.js";
import ErrorResponse from "../utils/ErrorResponseUtils.js";

export const getSavedJobs = catchAsync(async (req, res) => {
    const jobSeekerId = req.user._id;
    const { page = 1, limit = 10, sortBy = "savedAt", sortOrder = "desc" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [savedJobs, total] = await Promise.all([
        SavedJobModel.find({ jobSeekerId, isDeleted: false })
            .populate({
                path: "jobId",
                match: { isDeleted: false, status: "active" },
                select: "title department location isRemote experienceRequired skills education salary jobType openings isFeatured createdAt expiresAt employerId"
            })
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit)),
        SavedJobModel.countDocuments({ jobSeekerId, isDeleted: false })
    ]);

    const validSavedJobs = savedJobs.filter(savedJob => savedJob.jobId !== null);

    return apiSuccessResponse(res, "Saved jobs retrieved successfully", {
        savedJobs: validSavedJobs,
        pagination: {
            total: validSavedJobs.length,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(validSavedJobs.length / parseInt(limit))
        }
    });
});

export const saveJob = catchAsync(async (req, res, next) => {
    const { jobId, notes } = req.body;
    const jobSeekerId = req.user._id;

    // Check if job exists
    const job = await JobModel.findById(jobId);
    if (!job || job.isDeleted) {
        return next(new ErrorResponse("Job not found", HTTP_STATUS.NOT_FOUND));
    }

    // Check if already saved
    const existingSave = await SavedJobModel.findOne({ jobSeekerId, jobId, isDeleted: false });
    if (existingSave) {
        return apiErrorResponse(res, "Job already saved", null, HTTP_STATUS.BAD_REQUEST);
    }

    const savedJob = await SavedJobModel.create({
        jobSeekerId,
        jobId,
        notes: notes || "",
        savedAt: new Date()
    });

    const populatedSavedJob = await SavedJobModel.findById(savedJob._id)
        .populate("jobId", "title department location salary jobType");

    return apiSuccessResponse(
        res,
        "Job saved successfully",
        { savedJob: populatedSavedJob },
        HTTP_STATUS.CREATED
    );
});

export const unsaveJob = catchAsync(async (req, res, next) => {
    const { jobId } = req.params;
    const jobSeekerId = req.user._id;

    const savedJob = await SavedJobModel.findOne({ jobSeekerId, jobId, isDeleted: false });

    if (!savedJob) {
        return next(new ErrorResponse("Saved job not found", HTTP_STATUS.NOT_FOUND));
    }

    savedJob.isDeleted = true;
    savedJob.deletedAt = new Date();
    await savedJob.save();

    return apiSuccessResponse(res, "Job unsaved successfully", { jobId });
});

export const updateSavedJobNotes = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { notes } = req.body;
    const jobSeekerId = req.user._id;

    const savedJob = await SavedJobModel.findOne({ _id: id, jobSeekerId, isDeleted: false });

    if (!savedJob) {
        return next(new ErrorResponse("Saved job not found", HTTP_STATUS.NOT_FOUND));
    }

    savedJob.notes = notes;
    await savedJob.save();

    return apiSuccessResponse(res, "Notes updated successfully", { savedJob });
});

export const checkIfJobSaved = catchAsync(async (req, res) => {
    const { jobId } = req.params;
    const jobSeekerId = req.user._id;

    const savedJob = await SavedJobModel.findOne({ jobSeekerId, jobId, isDeleted: false });

    return apiSuccessResponse(res, "Check completed", {
        isSaved: !!savedJob,
        savedJobId: savedJob?._id || null
    });
});
