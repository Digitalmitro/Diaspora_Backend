import { JobAlertModel } from "../model/jobAlertModel.js";
import { JobModel } from "../model/jobModel.js";
import { apiSuccessResponse, apiErrorResponse, HTTP_STATUS } from "../utils/apiResponseUtils.js";
import { catchAsync } from "../utils/catchAsyncUtils.js";
import ErrorResponse from "../utils/ErrorResponseUtils.js";

export const getJobAlerts = catchAsync(async (req, res) => {
    const jobSeekerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [alerts, total] = await Promise.all([
        JobAlertModel.find({ jobSeekerId, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        JobAlertModel.countDocuments({ jobSeekerId, isDeleted: false })
    ]);

    const alertsWithCounts = await Promise.all(
        alerts.map(async (alert) => {
            const query = { status: "active", isDeleted: false };

            if (alert.location) {
                query.location = { $regex: alert.location, $options: "i" };
            }

            if (alert.skills && alert.skills.length > 0) {
                query["skills.name"] = { $in: alert.skills.map(s => new RegExp(s, "i")) };
            }

            if (alert.jobType && alert.jobType.length > 0) {
                query.jobType = { $in: alert.jobType };
            }

            if (alert.salaryMin) {
                query["salary.min"] = { $gte: alert.salaryMin };
            }

            const matchingJobsCount = await JobModel.countDocuments(query);

            return {
                ...alert.toObject(),
                matchingJobsCount
            };
        })
    );

    return apiSuccessResponse(res, "Job alerts retrieved successfully", {
        alerts: alertsWithCounts,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});

export const getJobAlertById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const jobSeekerId = req.user._id;

    const alert = await JobAlertModel.findOne({ _id: id, jobSeekerId, isDeleted: false });

    if (!alert) {
        return next(new ErrorResponse("Job alert not found", HTTP_STATUS.NOT_FOUND));
    }

    return apiSuccessResponse(res, "Job alert retrieved successfully", { alert });
});

export const createJobAlert = catchAsync(async (req, res) => {
    const { title, location, skills, jobType, salaryMin, frequency } = req.body;
    const jobSeekerId = req.user._id;

    const alert = await JobAlertModel.create({
        jobSeekerId,
        title,
        location: location || "",
        skills: skills || [],
        jobType: jobType || [],
        salaryMin: salaryMin || null,
        frequency: frequency || "weekly"
    });

    return apiSuccessResponse(
        res,
        "Job alert created successfully",
        { alert },
        HTTP_STATUS.CREATED
    );
});

export const updateJobAlert = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, location, skills, jobType, salaryMin, frequency } = req.body;
    const jobSeekerId = req.user._id;

    const alert = await JobAlertModel.findOne({ _id: id, jobSeekerId, isDeleted: false });

    if (!alert) {
        return next(new ErrorResponse("Job alert not found", HTTP_STATUS.NOT_FOUND));
    }

    if (title !== undefined) alert.title = title;
    if (location !== undefined) alert.location = location;
    if (skills !== undefined) alert.skills = skills;
    if (jobType !== undefined) alert.jobType = jobType;
    if (salaryMin !== undefined) alert.salaryMin = salaryMin;
    if (frequency !== undefined) alert.frequency = frequency;

    await alert.save();

    return apiSuccessResponse(res, "Job alert updated successfully", { alert });
});

export const deleteJobAlert = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const jobSeekerId = req.user._id;

    const alert = await JobAlertModel.findOne({ _id: id, jobSeekerId, isDeleted: false });

    if (!alert) {
        return next(new ErrorResponse("Job alert not found", HTTP_STATUS.NOT_FOUND));
    }

    alert.isDeleted = true;
    alert.deletedAt = new Date();
    await alert.save();

    return apiSuccessResponse(res, "Job alert deleted successfully", { alertId: id });
});

export const getMatchingJobsForAlert = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const jobSeekerId = req.user._id;

    const alert = await JobAlertModel.findOne({ _id: id, jobSeekerId, isDeleted: false });

    if (!alert) {
        return next(new ErrorResponse("Job alert not found", HTTP_STATUS.NOT_FOUND));
    }

    const query = { status: "active", isDeleted: false };

    if (alert.location) {
        query.location = { $regex: alert.location, $options: "i" };
    }

    if (alert.skills && alert.skills.length > 0) {
        query["skills.name"] = { $in: alert.skills.map(s => new RegExp(s, "i")) };
    }

    if (alert.jobType && alert.jobType.length > 0) {
        query.jobType = { $in: alert.jobType };
    }

    if (alert.salaryMin) {
        query["salary.min"] = { $gte: alert.salaryMin };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
        JobModel.find(query)
            .select("title department description location isRemote experienceRequired skills education salary jobType openings isFeatured createdAt")
            .populate("employerId", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        JobModel.countDocuments(query)
    ]);

    return apiSuccessResponse(res, "Matching jobs retrieved successfully", {
        jobs,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});
