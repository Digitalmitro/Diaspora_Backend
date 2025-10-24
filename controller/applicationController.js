import { ApplicationModel } from "../model/applicationModel.js";
import { JobModel } from "../model/jobModel.js";
import { JobSeekerProfileModel } from "../model/jobSeekerProfileModel.js";
import { calculateSkillsMatch } from "../utils/skillsMatcherUtils.js";
import { sendEmail } from "../utils/sendEmailUtils.js";
import { apiSuccessResponse, apiErrorResponse, HTTP_STATUS } from "../utils/apiResponseUtils.js";
import catchAsync from "../utils/catchAsyncUtils.js";

export const applyToJob = catchAsync(async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const jobSeekerId = req.user._id;

  const existingApplication = await ApplicationModel.findOne({ jobId, jobSeekerId, isDeleted: false });
  if (existingApplication) {
    return apiErrorResponse(res, "You have already applied to this job", null, HTTP_STATUS.BAD_REQUEST);
  }

  const job = await JobModel.findById(jobId);
  if (!job || job.isDeleted) {
    return apiErrorResponse(res, "Job not found", null, HTTP_STATUS.NOT_FOUND);
  }

  if (job.status !== "active") {
    return apiErrorResponse(res, "This job is not accepting applications", null, HTTP_STATUS.BAD_REQUEST);
  }

  const jobSeekerProfile = await JobSeekerProfileModel.findOne({ userId: jobSeekerId });
  if (!jobSeekerProfile) {
    return apiErrorResponse(res, "Job seeker profile not found", null, HTTP_STATUS.NOT_FOUND);
  }

  if (!jobSeekerProfile.resumeUrl && !jobSeekerProfile.resume?.url) {
    return apiErrorResponse(res, "Please upload your resume before applying", null, HTTP_STATUS.BAD_REQUEST);
  }

  const jobSkills = job.skills?.map(s => s.name) || [];
  const candidateSkills = jobSeekerProfile.skills || [];
  const skillsMatchResult = calculateSkillsMatch(jobSkills, candidateSkills);

  const application = await ApplicationModel.create({
    jobId,
    jobSeekerId,
    resumeUrl: jobSeekerProfile.resume?.url || jobSeekerProfile.resumeUrl,
    coverLetter: coverLetter || "",
    status: "applied",
    skillsMatchScore: skillsMatchResult.matchPercentage || 0,
    appliedAt: new Date()
  });

  const populatedApplication = await ApplicationModel.findById(application._id)
    .populate("jobId", "title department location salary jobType")
    .populate("jobSeekerId", "email fullName");

  try {
    await sendEmail({
      to: req.user.email,
      subject: `Application Submitted - ${job.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Application Submitted Successfully</h2>
          <p>Dear ${jobSeekerProfile.fullName},</p>
          <p>Your application for <strong>${job.title}</strong> at <strong>${job.department}</strong> has been submitted successfully.</p>
          <p><strong>Application Details:</strong></p>
          <ul>
            <li>Position: ${job.title}</li>
            <li>Location: ${job.location}</li>
            <li>Applied on: ${new Date().toLocaleDateString()}</li>
            <li>Skills Match: ${Math.round(skillsMatchResult.matchPercentage)}%</li>
          </ul>
          <p>You will be notified about the status of your application.</p>
          <br>
          <p>Best regards,<br>The Diaspora Team</p>
        </div>
      `,
      text: `Your application for ${job.title} has been submitted successfully.`
    });
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
  }

  return apiSuccessResponse(
    res,
    "Application submitted successfully",
    {
      application: populatedApplication,
      skillsMatch: {
        percentage: skillsMatchResult.matchPercentage,
        matchedSkills: skillsMatchResult.matchedSkills,
        missingSkills: skillsMatchResult.missingSkills
      }
    },
    HTTP_STATUS.CREATED
  );
});

export const getMyApplications = catchAsync(async (req, res) => {
  const jobSeekerId = req.user._id;
  const { status, page = 1, limit = 10, sortBy = "appliedAt", sortOrder = "desc" } = req.query;

  const query = { jobSeekerId, isDeleted: false };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [applications, total] = await Promise.all([
    ApplicationModel.find(query)
      .populate("jobId", "title department location salary jobType status expiresAt employerId")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit)),
    ApplicationModel.countDocuments(query)
  ]);

  return apiSuccessResponse(res, "Applications retrieved successfully", {
    applications,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

export const getApplicationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const jobSeekerId = req.user._id;

  const application = await ApplicationModel.findOne({ _id: id, jobSeekerId, isDeleted: false })
    .populate("jobId", "title department location salary jobType status description skills education expiresAt employerId")
    .populate("jobSeekerId", "email fullName phone");

  if (!application) {
    return apiErrorResponse(res, "Application not found", null, HTTP_STATUS.NOT_FOUND);
  }

  return apiSuccessResponse(res, "Application retrieved successfully", { application });
});

export const withdrawApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const jobSeekerId = req.user._id;

  const application = await ApplicationModel.findOne({ _id: id, jobSeekerId, isDeleted: false });

  if (!application) {
    return apiErrorResponse(res, "Application not found", null, HTTP_STATUS.NOT_FOUND);
  }

  if (application.status !== "applied") {
    return apiErrorResponse(
      res,
      `Cannot withdraw application. Current status: ${application.status}`,
      null,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  application.isDeleted = true;
  application.deletedAt = new Date();
  await application.save();

  const job = await JobModel.findById(application.jobId);

  try {
    await sendEmail({
      to: req.user.email,
      subject: `Application Withdrawn - ${job?.title || "Position"}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Application Withdrawn</h2>
          <p>Your application for <strong>${job?.title || "the position"}</strong> has been withdrawn successfully.</p>
          <p>You can reapply for this position if you change your mind.</p>
          <br>
          <p>Best regards,<br>The Diaspora Team</p>
        </div>
      `,
      text: `Your application has been withdrawn successfully.`
    });
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
  }

  return apiSuccessResponse(res, "Application withdrawn successfully", { applicationId: id });
});

export const getApplicationsByJobId = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const { status, page = 1, limit = 10, sortBy = "appliedAt", sortOrder = "desc" } = req.query;

  const job = await JobModel.findById(jobId);
  if (!job || job.isDeleted) {
    return apiErrorResponse(res, "Job not found", null, HTTP_STATUS.NOT_FOUND);
  }

  if (job.employerId.toString() !== req.user._id.toString()) {
    return apiErrorResponse(res, "Unauthorized to view these applications", null, HTTP_STATUS.FORBIDDEN);
  }

  const query = { jobId, isDeleted: false };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [applications, total] = await Promise.all([
    ApplicationModel.find(query)
      .populate("jobSeekerId", "email fullName phone")
      .populate({
        path: "jobSeekerId",
        populate: {
          path: "userId",
          model: "JobSeekerProfile",
          select: "skills education experiences bio profilePicture"
        }
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit)),
    ApplicationModel.countDocuments(query)
  ]);

  return apiSuccessResponse(res, "Applications retrieved successfully", {
    applications,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

export const updateApplicationStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const application = await ApplicationModel.findOne({ _id: id, isDeleted: false })
    .populate("jobId", "employerId title")
    .populate("jobSeekerId", "email fullName");

  if (!application) {
    return apiErrorResponse(res, "Application not found", null, HTTP_STATUS.NOT_FOUND);
  }

  if (application.jobId.employerId.toString() !== req.user._id.toString()) {
    return apiErrorResponse(res, "Unauthorized to update this application", null, HTTP_STATUS.FORBIDDEN);
  }

  application.status = status;
  await application.save();

  try {
    const statusMessages = {
      shortlisted: "Your application has been shortlisted!",
      interviewed: "You have been selected for an interview!",
      rejected: "Unfortunately, your application was not selected this time."
    };

    if (statusMessages[status]) {
      await sendEmail({
        to: application.jobSeekerId.email,
        subject: `Application Status Update - ${application.jobId.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Application Status Update</h2>
            <p>Dear ${application.jobSeekerId.fullName},</p>
            <p>${statusMessages[status]}</p>
            <p><strong>Position:</strong> ${application.jobId.title}</p>
            <p><strong>New Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
            <br>
            <p>Best regards,<br>The Diaspora Team</p>
          </div>
        `,
        text: statusMessages[status]
      });
    }
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
  }

  return apiSuccessResponse(res, "Application status updated successfully", { application });
});
