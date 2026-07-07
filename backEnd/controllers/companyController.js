const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Applications");

const getMyCompany = async(req,res)=>{
    const userId = req.user.userId;
    try{
        //check if company exist
        const companyFound = await Company.findOne({createdBy:userId});
        if(!companyFound){   //not found
            return res.status(404).json({
                success:false,
                message:"Company not found"
            });
        }

        //found
        return res.status(200).json({
            success:true,
            message:"Company details fetched successfully",
            company : {
                //return company details
                id: companyFound._id,
                companyName: companyFound.companyName,
                description: companyFound.description,
                website: companyFound.website,
                location: companyFound.location,
                logo: companyFound.logo,
                isActive : companyFound.isActive
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const updateCompanyProfile=async(req,res)=>{
    const {companyName,description,website,location,logo} = req.body
    //validate companyname
    if(companyName!==undefined && companyName.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Company name cannot be empty"
        });
    }
    //validate description
    if(description!==undefined && description.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Description cannot be empty"
        });
    }
    //validate website
    if(website!==undefined && website.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Website cannot be empty"
        });
    }
    //validate location
    if(location!==undefined && location.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Location cannot be empty"
        });
    }
    //validate logo
    if(logo!==undefined && logo.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Logo cannot be empty"
        });
    }
    //check if no updates
    if(!companyName && !description && !website && !location && !logo){
        return res.status(400).json({
            success:false,
            message:"Nothing to update"
        });
    }
    //validation over
    //now find company and update deatils
    const userId = req.user.userId;
    try{
        const myCompany = await Company.findOne({createdBy:userId});
        if(!myCompany){   //company not found
            return res.status(404).json({
                success:false,
                message:"Company not found"
            })
        }
        //update companyName if provided
        if(companyName!==undefined){
            myCompany.companyName = companyName;
        }
        //update description if provided
        if(description!==undefined){
            myCompany.description = description;
        }
        //update website if provided
        if(website!==undefined){
            myCompany.website = website;
        }
        //update location if provided
        if(location!==undefined){
            myCompany.location = location;
        }
        //update logo if provided
        if(logo!==undefined){
            myCompany.logo = logo;
        }
        await myCompany.save();
        return res.status(200).json({
            success:true,
            message:"Company updated successfully",
            company : {
                id: myCompany._id,
                companyName: myCompany.companyName,
                description: myCompany.description,
                website: myCompany.website,
                location: myCompany.location,
                logo: myCompany.logo,
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

const toggleStatus=async(req,res)=>{
    const userId = req.user.userId;
    try{
        const myCompany = await Company.findOne({createdBy:userId});
        if(!myCompany){  //company not found
            return res.status(404).json({
                success:false,
                message:"Company not found"
            })
        }
        myCompany.isActive = !myCompany.isActive;
        await myCompany.save();
        return res.status(200).json({
            success:true,
            message:"Company status updated successfully",
            isActive : myCompany.isActive
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const deleteCompany=async(req,res)=>{
    const companyId = req.params.companyId;
    //validate objectId
    if(!mongoose.Types.ObjectId.isValid(companyId)){
        return res.status(400).json({
            success:false,
            message:"Invalid Company id"
        })
    }

    try{
        const myCompany = await Company.findById(companyId);
        //check if company found
        if(!myCompany){
            return res.status(404).json({
                success:false,
                message:"Company not found"
            });
        }
        //verify recruiter owns the company
        if(myCompany.createdBy.toString() !== req.user.userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this company"
            });
        }
        //fetch all jobs of this company
        const allJobs = await Job.find({company:companyId});
        //check if any job has status = open
        for (const job of allJobs) {
            if (job.status==="open"){
                return res.status(409).json({
                    success:false,
                    message:"Cannot delete company while open jobs exist"
                });
            }
        }
        //delete all applications related to the closed jobs
        const jobIds = allJobs.map(job=>job._id);
        //delete all related applications and jobs
        await Application.deleteMany({job:{$in:jobIds}});
        await Job.deleteMany({company:companyId});
        //delete company
        await myCompany.deleteOne();
        return res.status(200).json({
            success:true,
            message:"Company successfully deleted"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}
module.exports = {getMyCompany,updateCompanyProfile,toggleStatus,deleteCompany};