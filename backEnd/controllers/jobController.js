const Job = require("../models/Job");
const Company = require("../models/Company");
const mongoose = require("mongoose");

//RECRUITER SIDE APIS
const postJob = async(req,res)=>{
    const {title,description,skillsRequired,responsibilities,salary,
        experienceLevel,location,employmentType,workMode
    } = req.body;
    //check if all are provided
    if(!title || !description || salary===undefined || 
        experienceLevel===undefined || !location || !employmentType || !workMode){
            return res.status(400).json({
                success:false,
                message:"Required fields cannot be empty"
            });
        }
    //validate title
    if(title!==undefined && title.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Title should not be empty"
        });
    }
    //validate description
    if(description!==undefined && description.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Description should not be empty"
        });
    }
    //validate skillsRequired
    if(skillsRequired!==undefined && !Array.isArray(skillsRequired)){
        return res.status(400).json({
            success:false,
            message:"Skills Required must be an array"
        })
    }
    //validate responsibilities
    if(responsibilities!==undefined && !Array.isArray(responsibilities)){
        return res.status(400).json({
            success:false,
            message:"Responsibilities must be an array"
        })
    }
    //validate salary
    if(salary!==undefined && salary<0){
        return res.status(400).json({
            success:false,
            message:"Salary should not be negative"
        });
    }
    //validate experienceLevel
    if(experienceLevel!==undefined && experienceLevel<0){
        return res.status(400).json({
            success:false,
            message:"ExperienceLevel should not be negative"
        });
    }
    //validate location
    if(location!==undefined && location.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Location should not be empty"
        });
    }//validate employmentType
    if(employmentType!==undefined && employmentType.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Employment Type should not be empty"
        });
    }
    //validate workMode
    if(workMode!==undefined && workMode.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Work Mode should not be empty"
        });
    }
    //validation over
    const userId = req.user.userId;
    try{
        const myCompany = await Company.findOne({createdBy:userId});
        if(!myCompany){   //company not found
            return res.status(404).json({
                success:false,
                message:"Company not found"
            });
        }
        //check if company active
        if(myCompany.isActive===false){
            return res.status(403).json({
                success:false,
                message:"Activate your company before posting jobs"
            });
        }
        //Create the job
        const myJob = await Job.create({
            title:title,
            description:description,
            skillsRequired:skillsRequired,
            responsibilities:responsibilities,
            salary:salary,
            experienceLevel:experienceLevel,
            location:location,
            employmentType : employmentType,
            status:"open",
            company : myCompany._id,
            postedBy:userId,
            workMode:workMode
        })
        //successfully created
        return res.status(200).json({
            success:true,
            message:"Job posted successfully",
            job : {
                id:myJob._id,
                title:myJob.title,
                description:myJob.description,
                skillsRequired:myJob.skillsRequired,
                responsibilities:myJob.responsibilities,
                salary:myJob.salary,
                experienceLevel:myJob.experienceLevel,
                location:myJob.location,
                employmentType : myJob.employmentType,
                status:myJob.status,
                company : myJob.company,
                postedBy:myJob.postedBy,
                workMode:myJob.workMode
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
    
}


const getMyJobs=async(req,res)=>{
    const userId = req.user.userId;
    try{
        const myAllJobs = await Job.find({postedBy:userId}).sort({createdAt:-1});
        return res.status(200).json({
            success:true,
            message:"Jobs fetched successfully",
            jobs : myAllJobs
        });
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

const getJobById=async(req,res)=>{
    const jobId = req.params.id;
    //validate objectId
    if(!mongoose.Types.ObjectId.isValid(jobId)){
        return res.status(400).json({
            success:false,
            message:"Invalid job id"
        })
    }
    try{
        const myJob = await Job.findById(jobId).populate("company");
        if(!myJob){   //job not found
            return res.status(404).json({
                success:false,
                message:"Job not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Job fetched successfully",
            job : {
                id:myJob._id,
                title:myJob.title,
                description:myJob.description,
                skillsRequired : myJob.skillsRequired,
                responsibilities:myJob.responsibilities,
                salary:myJob.salary,
                experienceLevel:myJob.experienceLevel,
                location:myJob.location,
                employmentType:myJob.employmentType,
                status:myJob.status,
                company:myJob.company,
                workMode:myJob.workMode
            }
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const updateJobById=async(req,res)=>{
    const {title,description,skillsRequired,responsibilities,salary,
        experienceLevel,location,employmentType,workMode,status
    } = req.body;
    //validate provided fields
    //validate title
    if(title!==undefined && title.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Title should not be empty"
        });
    }
    //validate description
    if(description!==undefined && description.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Description should not be empty"
        });
    }
    //validate skillsRequired
    if(skillsRequired!==undefined && !Array.isArray(skillsRequired)){
        return res.status(400).json({
            success:false,
            message:"Skills Required must be an array"
        })
    }
    //validate responsibilities
    if(responsibilities!==undefined && !Array.isArray(responsibilities)){
        return res.status(400).json({
            success:false,
            message:"Responsibilities must be an array"
        })
    }

    //validate salary
    if(salary!==undefined && salary<0){
        return res.status(400).json({
            success:false,
            message:"Salary should not be negative"
        });
    }
    //validate experienceLevel
    if(experienceLevel!==undefined && experienceLevel<0){
        return res.status(400).json({
            success:false,
            message:"ExperienceLevel should not be negative"
        });
    }
    //validate location
    if(location!==undefined && location.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Location should not be empty"
        });
    }//validate employmentType
    if(employmentType!==undefined && employmentType.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Employment Type should not be empty"
        });
    }
    if(status!==undefined && status!=="open" && status!=="closed"){
        return res.status(400).json({
            success:false,
            message:"Status must be either open or closed"
        })
    }
    //validate workMode
    if(workMode!==undefined && workMode.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Work Mode should not be empty"
        });
    }
    //check if none provided
    if(title === undefined && description === undefined &&
    skillsRequired === undefined && responsibilities === undefined &&
    salary === undefined && experienceLevel === undefined &&
    location === undefined && employmentType === undefined &&
    workMode === undefined && status===undefined ){
        return res.status(400).json({
            success:false,
            message:"Nothing to update"
        });
    }
    //validation over
    const jobId = req.params.id;
    //validate objectId
    if(!mongoose.Types.ObjectId.isValid(jobId)){
        return res.status(400).json({
            success:false,
            message:"Invalid job id"
        })
    }
    try{
        const myJob = await Job.findById(jobId);
        if(!myJob){
            return res.status(404).json({
                success:false,
                message:"Job not found"
            });
        }
        //verify recruiter owms it
        if(myJob.postedBy.toString()!==req.user.userId){
            return res.status(403).json({
                success:false,
                message:"Forbidden access"
            });
        }
        //all checks provided, now update only the required fields
        //update title if provided
        if(title!==undefined){
            myJob.title = title;
        }
        //update description if provided
        if(description!==undefined){
            myJob.description = description;
        }
        //update salary if provided
        if(salary!==undefined){
            myJob.salary = salary;
        }
        //update experienceLevel if provided
        if(experienceLevel!==undefined){
            myJob.experienceLevel = experienceLevel;
        }
        //update location if provided
        if(location!==undefined){
            myJob.location = location;
        }
        //update workMode if provided
        if(workMode!==undefined){
            myJob.workMode = workMode;
        }
        if(status!==undefined){
            myJob.status = status;
        }
        //update employmentType if provided
        if(employmentType!==undefined){
            myJob.employmentType = employmentType;
        }
        //update skillsRequired if provided
        if(skillsRequired!==undefined){
            myJob.skillsRequired = skillsRequired;
        }
        //update responsibilities if provided
        if(responsibilities!==undefined){
            myJob.responsibilities = responsibilities;
        }
        //updation over
        await myJob.save();
        return res.status(200).json({
            success:true,
            message:"Job updated successfully",
            job:{
                id:myJob._id,
                title:myJob.title,
                description:myJob.description,
                skillsRequired : myJob.skillsRequired,
                responsibilities:myJob.responsibilities,
                salary:myJob.salary,
                experienceLevel:myJob.experienceLevel,
                location:myJob.location,
                employmentType:myJob.employmentType,
                status:myJob.status,
                company:myJob.company,
                workMode:myJob.workMode
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

const deleteJobById=async(req,res)=>{
    const jobId = req.params.id;
    //validate objectId
    if(!mongoose.Types.ObjectId.isValid(jobId)){
        return res.status(400).json({
            success:false,
            message:"Invalid job id"
        })
    }
    try{
        const myJob = await Job.findById(jobId);
        //check if exists
        if(!myJob){
            return res.status(404).json({
                success:false,
                message:"Job not found"
            })
        }
        //verify ownership
        if(myJob.postedBy.toString()!==req.user.userId){
            return res.status(403).json({
                success:false,
                message:"Forbidden access"
            });
        }
        //delete
        await myJob.deleteOne();
        return res.status(200).json({
            success:true,
            message:"Job deleted successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

//CANDIDATE SIDE APIS
const getAllJobs=async(req,res)=>{
    try{
        const {keyword,skills,location,employmentType,
            workMode,experienceLevel,minSalary,maxSalary} = req.query;
        let query = {status:"open"};
        
        //check if keyword filter exists
        if(keyword){
            query.$or = [
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ];
        }
        //check if skills filter exists
        if(skills){
            const skillsArray = skills
                .split(",")
                .map(skill => new RegExp(`^${skill.trim()}$`, "i"));

            query.skillsRequired = {
                $in: skillsArray
            };
        }

        //check if location filter exists
        if(location){
            query.location = {
                $regex: `^${location}$`,
                $options: "i"
            };
        }

        //check if employmentType exists
        if(employmentType){
            query.employmentType = {
                $regex: `^${employmentType}$`,
                $options: "i"
            };
        }

        //check if workMode
        if(workMode){
            query.workMode = {
                $regex: `^${workMode}$`,
                $options: "i"
            };
        }
        //check if experienceLevel exists
        if(experienceLevel){
            query.experienceLevel = {$lte:Number(experienceLevel)};
        }
        //check if filter for salary
        if(minSalary || maxSalary){
            query.salary = {};
            if(minSalary){
                query.salary.$gte = Number(minSalary);
            }
            if(maxSalary){
                query.salary.$lte = Number(maxSalary);
            }
        }
        //for pagination
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        if(page<1)page=1;
        if(limit<1)limit=1;
        if(limit>50)limit=50;
        let skip = (page-1)*limit;

        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query).sort({createdAt:-1})
        .skip(skip).limit(limit);
        const totalPages = Math.ceil(totalJobs/limit);

        return res.status(200).json({
            success:true,
            message:"All Jobs fetched successfully",
            jobs : jobs,
            pagination:{
                page,
                limit,
                totalJobs,
                totalPages,
                hasNextPage: page<totalPages,
                hasPreviousPage : page>1
            }
        });

        
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message : "Internal server error"
        })
    
    }
}


module.exports = {postJob,getMyJobs,getJobById,updateJobById,deleteJobById,getAllJobs};