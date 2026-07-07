const Application = require("../models/Applications");
const Job = require("../models/Job");
const User = require("../models/User");

const applyJobById=async(req,res)=>{
    const jobId = req.params.jobId;
    //validate objectId
    if(!mongoose.Types.ObjectId.isValid(jobId)){
        return res.status(400).json({
            success:false,
            message:"Invalid job id"
        })
    }
    try{
        const myJob = await Job.findById(jobId).populate("company");
        //if job not found
        if(!myJob){
            return res.status(404).json({
                success:false,
                message:"Job not found"
            });
        }
        //check if job is closed
        if(myJob.status==="closed"){
            return res.status(403).json({
                success:false,
                message:"Job opening is now closed"
            });
        }
        //check if company is Active
        if(myJob.company.isActive===false){
            return res.status(403).json({
                success:false,
                message:"Company currently inactive"
            });
        }
        const userId = req.user.userId;
        //check if application already exists for user
        const oldApplication = await Application.findOne({applicant:userId,job:jobId});
        if(oldApplication){
            return res.status(409).json({
                success:false,
                message:"You have already applied for this job"
            });
        }
        //create application
        const myApplication = await Application.create({
            applicant : userId,
            job : jobid,
            status : "pending"
        });
        return res.status(201).json({
            success:true,
            message:"Application submitted successfully",
            application : {
                id: myApplication._id,
                applicant: myApplication.applicant,
                job: myApplication.job,
                status: myApplication.status
            }
        });
    }catch(err){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal sever error"
        });
    }
}

const getAllApplications=async(req,res)=>{
    const userId = req.user.userId;
    //get all applications of the user and sort
    try{
        const myApplications = await Application.find({applicant:userId})
        .populate({
            path:"job",
            populate:{
                path:"company"
            }
        }).sort({createdAt:-1});
        return res.status(200).json({
            success:true,
            applications : myApplications
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

//RECRUITER APIS
const getApplicationsByJobId=async(req,res)=>{
    const jobId = req.params.jobId;
    const userId = req.user.userId;
    //validate objectId
    if(!mongoose.Types.ObjectId.isValid(jobId)){
        return res.status(400).json({
            success:false,
            message:"Invalid job id"
        })
    }
    try{
        const myJob = await Job.findById(jobId);
        //check if job does not exist
        if(!myJob){
            return res.status(404).json({
                success:false,
                message:"Job not found"
            });
        }
        //verify if the job was posted by this recruiter
        if(myJob.postedBy.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"Viewing access denied"
            });
        }
        //fetch all applications for this job
        const allApplications = await Application.find({job:jobId}).populate("applicant","fullName email phoneNumber profilePhoto bio skills resume").sort({createdAt:-1});
        return res.status(200).json({
            success:true,
            applications: allApplications
        });
        }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

const updateStatus = async(req,res)=>{
    const applicationId = req.params.applicationId;
    //validate objectId
    if(!mongoose.Types.ObjectId.isValid(applicationId)){
        return res.status(400).json({
            success:false,
            message:"Invalid Application id"
        })
    }
    const newStatus = req.body.newStatus;
    //validate new Status
    if(newStatus!=="pending" && newStatus!=="shortlisted" &&
       newStatus!=="accepted" && newStatus!=="rejected"){
        return res.status(400).json({
            success:false,
            message:"Invalid application status"
        });
    }

    try{
        const myApplication = await Application.findById(applicationId).populate("job","postedBy");
        //check if application exists
        if(!myApplication){
            return res.status(404).json({
                success:false,
                message:"Application not found"
            });
        }
        //verify if the job was posted by this recruiter
        if(myApplication.job.postedBy.toString() !== req.user.userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to update this application."
            });
        }
        //update status and save
        myApplication.status = newStatus;
        await myApplication.save();
        return res.status(200).json({
            success:true,
            message:"Application updated successfully",
            updatedApplication:myApplication
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}
module.exports = {applyJobById,getAllApplications,getApplicationsByJobId,updateStatus};
