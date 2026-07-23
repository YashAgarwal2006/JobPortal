const Application = require("../models/Applications");
const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const { getJobById } = require("./jobController");

const applyJobById = async (req, res) => {
    console.log("req body ",req.body);
    console.log("req file ",req.file);
    const jobId = req.params.jobId;
    //validate objectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid job id"
        })
    }
    try {
        const myJob = await Job.findById(jobId).populate("company");
        //if job not found
        if (!myJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        //check if job is closed
        if (myJob.status === "closed") {
            return res.status(403).json({
                success: false,
                message: "Job opening is now closed"
            });
        }
        //check if company is Active
        if (myJob.company.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Company currently inactive"
            });
        }
        const userId = req.user.userId;
        //check if application already exists for user
        const oldApplication = await Application.findOne({ applicant: userId, job: jobId });
        if (oldApplication) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job"
            });
        }
        //create application
        const { fullName, email, phoneNumber, skills,bio } = req.body;
        const resume = req.file?.path || req.body.existingResume ; 
        console.log("Final resume",resume);
        //check if all are provided
        if (!fullName || !email || !phoneNumber || !bio || !skills || !resume) {
            return res.status(400).json({
                success: false,
                message: "Required fields cannot be empty"
            });
        }
        //validate fullName
        if (fullName !== undefined && fullName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Name should not be empty"
            });
        }
        //validate email
        if (email !== undefined && email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Email should not be empty"
            });
        }
        //validate phone number
        if (phoneNumber !== undefined && phoneNumber.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Phone Number should not be empty"
            });
        }
        const skillsArray = skills
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill !== "");
        const myApplication = await Application.create({
            applicant: userId,
            job: jobId,
            fullName,
            email,
            phoneNumber,
            bio,
            skills: skillsArray,
            resume,
            status: "pending"
        });
        myJob.applicationCount += 1;
        await myJob.save();
        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application: {
                id: myApplication._id,
                applicant: myApplication.applicant,
                job: myApplication.job,
                fullName: myApplication.fullName,
                email: myApplication.email,
                phoneNumber: myApplication.phoneNumber,
                bio: myApplication.bio,
                skills: myApplication.skills,
                resume: myApplication.resume,
                status: myApplication.status
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal sever error"
        });
    }
}

const getAllApplications = async (req, res) => {
    const userId = req.user.userId;
    //get all applications of the user and sort
    try {
        const myApplications = await Application.find({ applicant: userId })
            .populate({
                path: "job",
                select:"title location employmentType workMode salary company",
                populate: {
                    path: "company",
                    select : "companyName logo"

                }
            }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            applications: myApplications
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//RECRUITER APIS
const getApplicationsByJobId = async (req, res) => {
    const jobId = req.params.jobId;
    const userId = req.user.userId;
    //validate objectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid job id"
        })
    }
    try {
        const myJob = await Job.findById(jobId);
        //check if job does not exist
        if (!myJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        //verify if the job was posted by this recruiter
        if (myJob.postedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Viewing access denied"
            });
        }
        //fetch all applications for this job
        const allApplications = await Application.find({ job: jobId }).populate("applicant", "profilePhoto").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            job: {
                id: myJob._id,
                title: myJob.title,
                applicationCount: myJob.applicationCount,
                status: myJob.status
            },
            applications: allApplications
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const updateStatus = async (req, res) => {
    const applicationId = req.params.applicationId;
    //validate objectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Application id"
        })
    }
    const newStatus = req.body.newStatus;
    //validate new Status
    if (newStatus !== "pending" && newStatus !== "shortlisted" &&
        newStatus !== "accepted" && newStatus !== "rejected") {
        return res.status(400).json({
            success: false,
            message: "Invalid application status"
        });
    }

    try {
        const myApplication = await Application.findById(applicationId).populate("job", "postedBy");
        //check if application exists
        if (!myApplication) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }
        //verify if the job was posted by this recruiter
        if (myApplication.job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this application."
            });
        }
        //update status and save
        myApplication.status = newStatus;
        await myApplication.save();
        await myApplication.populate("applicant", "fullName email phoneNumber profilePhoto bio skills resume")
        return res.status(200).json({
            success: true,
            message: "Application updated successfully",
            updatedApplication: myApplication
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getRecentApplications = async (req, res) => {
    const userId = req.user.userId;
    try {
        const myJobs = await Job.find({ postedBy: userId }, "_id");
        //no jobs found
        if (myJobs.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No jobs posted yet",
                applications: []
            });
        }
        const jobIds = myJobs.map(job => job._id);
        console.log("Trying to fetch..")
        const recentApplications = await Application.find({ job: { $in: jobIds } })
            .populate("applicant", "fullName email profilePhoto")
            .populate("job", "_id title")
            .sort({ createdAt: -1 })
            .limit(5);
        console.log("Fetched recent applications")
        return res.status(200).json({
            success: true,
            message: "Recent applications fetched successfully",
            applications: recentApplications
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const checkApplicationStatus = async (req, res) => {
    const jobId = req.params.jobId;
    //validate objectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Job id"
        })
    }
    try {
        const myJob = await Job.findById(jobId);
        //if job not found
        if (!myJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        const userId = req.user.userId;
        const myApplication = await Application.findOne({ applicant: userId, job: jobId });
        //if application found
        if (myApplication) {
            return res.status(200).json({
                success: true,
                alreadyApplied: true,
                applicationId: myApplication._id,
                message: "Candidate has already applied"
            })
        }
        //application not found
        return res.status(200).json({
            success: true,
            alreadyApplied: false,
            applicationId:null,
            message: "Candidate has not applied"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { applyJobById, getAllApplications, getApplicationsByJobId, updateStatus, getRecentApplications, checkApplicationStatus };
