import { JobModel } from "../model/jobModel.js";
import { UserModel } from "../model/authModel.js";
import { EmployerProfileModel } from "../model/employerProfileModel.js";
import { TestimonialModel } from "../model/testimonialModel.js";
import { PartnerModel } from "../model/partnerModel.js";
import { FAQModel } from "../model/faqModel.js";
import { apiSuccessResponse, apiErrorResponse, HTTP_STATUS } from "../utils/apiResponseUtils.js";
import catchAsync from "../utils/catchAsyncUtils.js";

export const searchJobs = catchAsync(async (req, res) => {
    const { title, location, skills, jobType, page = 1, limit = 10 } = req.query;

    const query = { status: "active", isDeleted: false };

    if (title) {
        query.title = { $regex: title, $options: "i" };
    }

    if (location) {
        query.location = { $regex: location, $options: "i" };
    }

    if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
        query["skills.name"] = { $in: skillsArray.map(s => new RegExp(s, "i")) };
    }

    if (jobType) {
        query.jobType = jobType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
        JobModel.find(query)
            .select("title department description location isRemote experienceRequired skills education salary jobType openings isFeatured createdAt expiresAt")
            .populate("employerId", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        JobModel.countDocuments(query)
    ]);

    return apiSuccessResponse(res, "Jobs retrieved successfully", {
        jobs,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});

export const getJobById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const job = await JobModel.findOne({ _id: id, status: "active", isDeleted: false })
        .select("-rejectionReason")
        .populate({
            path: "employerId",
            select: "name",
            populate: {
                path: "userId",
                model: "EmployerProfile",
                select: "companyName logo"
            }
        });

    if (!job) {
        return apiErrorResponse(res, "Job not found", null, HTTP_STATUS.NOT_FOUND);
    }

    const employerProfile = await EmployerProfileModel.findOne({ userId: job.employerId._id });

    const sanitizedJob = {
        ...job.toObject(),
        employer: {
            companyName: employerProfile?.companyName || "Company",
            logo: employerProfile?.logo || null
        }
    };

    delete sanitizedJob.employerId;

    return apiSuccessResponse(res, "Job retrieved successfully", { job: sanitizedJob });
});

export const getStats = catchAsync(async (req, res) => {
    const [totalJobs, totalEmployers, totalJobSeekers] = await Promise.all([
        JobModel.countDocuments({ status: "active", isDeleted: false }),
        UserModel.countDocuments({ role: "employer", isDeleted: false, isActive: true }),
        UserModel.countDocuments({ role: "seeker", isDeleted: false, isActive: true })
    ]);

    return apiSuccessResponse(res, "Statistics retrieved successfully", {
        stats: {
            totalJobs,
            totalEmployers,
            totalJobSeekers
        }
    });
});

export const getTestimonials = catchAsync(async (req, res) => {
    const testimonials = await TestimonialModel.find({ isDeleted: false })
        .select("name designation company imageUrl quote rating order")
        .sort({ order: 1, createdAt: -1 });

    return apiSuccessResponse(res, "Testimonials retrieved successfully", { testimonials });
});

export const getPartners = catchAsync(async (req, res) => {
    const partners = await PartnerModel.find({ isDeleted: false })
        .select("name logoUrl websiteUrl order")
        .sort({ order: 1, createdAt: -1 });

    return apiSuccessResponse(res, "Partners retrieved successfully", { partners });
});

export const getFAQs = catchAsync(async (req, res) => {
    const { category } = req.query;

    const query = { isDeleted: false };
    if (category) {
        query.category = category;
    }

    const faqs = await FAQModel.find(query)
        .select("question answer category order")
        .sort({ order: 1, createdAt: -1 });

    return apiSuccessResponse(res, "FAQs retrieved successfully", { faqs });
});
