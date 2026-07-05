const User = require("../models/User");

const getMyProfile=async(req,res)=>{
    const userId = req.user.userId;
    try{
        const myUser = await User.findOne({_id:userId}).select("-password").populate("company");
        if(!myUser){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        //return user info
        return res.status(200).json({
            success:true,
            user: {
                id:myUser._id,
                fullName : myUser.fullName,
                email : myUser.email,
                role : myUser.role,
                phoneNumber: myUser.phoneNumber,
                profilePhoto : myUser.profilePhoto,
                bio: myUser.bio,
                skills : myUser.skills,
                resume:myUser.resume,
                company : myUser.company
            }
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
    
}

const updateProfile=async(req,res)=>{
    const {fullName,phoneNumber,profilePhoto,bio,skills,resume} = req.body;
    //validate fullName
    if(fullName && fullName.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Full name cannot be empty"
        });
    }
    //validate phoneNumber
    if(phoneNumber && phoneNumber.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Phone Number cannot be empty."
        });
    }
    //validate bio
    if(bio && bio.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Bio cannot be empty."
        });
    }
    //validate skills
    if(skills!==undefined && !Array.isArray(skills)){
        return res.status(400).json({
            success:false,
            message:"Array not in the required format"
        });
    }
    //check if no updates
    if(!fullName && !phoneNumber && !bio && !skills && !profilePhoto && !resume){
        return res.status(400).json({
            success:false,
            message:"Nothing to update"
        });
    }
    //validations over
    //now finduser and update profile
    try{
        const userId = req.user.userId;
        const myUser = await User.findById(userId);

        if(!myUser){  //user not found
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        //update fullName if provided
        if(fullName!==undefined){
            myUser.fullName = fullName;
        }
        //update phoneNumber if provided
        if(phoneNumber!==undefined){
            myUser.phoneNumber = phoneNumber;
        }
        //update profilePhoto if provided
        if(profilePhoto!==undefined){
            myUser.profilePhoto = profilePhoto;
        }
        //update bio if provided
        if(bio!==undefined){
            myUser.bio = bio;
        }
        //update skills if provided
        if(skills!==undefined){
            myUser.skills = skills;
        }
        //update resume if provided
        if(resume!==undefined){
            myUser.resume = resume;
        }
        await myUser.save();
        res.status(200).json({
            success:true,
            message : "User Profile updated successfully",
            user:{
                id:myUser._id,
                fullName : myUser.fullName,
                email : myUser.email,
                role : myUser.role,
                phoneNumber: myUser.phoneNumber,
                profilePhoto : myUser.profilePhoto,
                bio: myUser.bio,
                skills : myUser.skills,
                resume:myUser.resume,
                company : myUser.company
            }
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = {getMyProfile,updateProfile};