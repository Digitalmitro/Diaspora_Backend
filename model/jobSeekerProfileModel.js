import mongoose from "mongoose";

const JobSeekerProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        resumeUrl: {
            type: String,
            default: null,
        },
        skills: {
            type: [String],
            default: [],
        },
        experience: [
            {
                jobTitle: {
                    type: String,
                    trim: true,
                },
                company: {
                    type: String,
                    trim: true,
                },
                location: {
                    type: String,
                    trim: true,
                },
                startDate: {
                    type: Date,
                },
                endDate: {
                    type: Date,
                },
                currentlyWorking: {
                    type: Boolean,
                    default: false,
                },
                description: {
                    type: String,
                },
            },
        ],
        education: [
            {
                degree: {
                    type: String,
                    trim: true,
                },
                institution: {
                    type: String,
                    trim: true,
                },
                fieldOfStudy: {
                    type: String,
                    trim: true,
                },
                startDate: {
                    type: Date,
                },
                endDate: {
                    type: Date,
                },
                currentlyStudying: {
                    type: Boolean,
                    default: false,
                },
                grade: {
                    type: String,
                    trim: true,
                },
            },
        ],
        preferredLocations: {
            type: [String],
            default: [],
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        profilePicture: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("JobSeekerProfile", JobSeekerProfileSchema);
