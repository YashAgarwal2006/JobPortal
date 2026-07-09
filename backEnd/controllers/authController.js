const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

let session; //to create mongodb sessions

const signup = async(req,res)=>{
    //read all fields
    let session; //to create mongodb sessions
    const {fullName,email,password,confirmPassword,role,phoneNumber} = req.body;
    //manual validations

    //1.check if all reqd fields are entered
    if(!fullName || !email || !password || !role || !phoneNumber){
        return res.status(400).json({
            success:false,
            message:"Required field cannot be left blank"
        });
    }
    //2. check pwd and confirmpwd
    if(password !== confirmPassword){
        return res.status(400).json({
            success : false,
            message : "Both passwords do not match"
        });
    }
    
    //3.role validity
    if(role!=="recruiter" && role!=="candidate"){
        return res.status(400).json({
            success : false,
            message : "Role must be either recruiter or candidate"
        });
    }

    try{
        //4. check if email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"User already exists"
            });
        }

        //5. hash passwords using bcrypt
        const hashedPassword = await bcrypt.hash(password,12);
        
        //6.start mongodb session and transaction
        session = await mongoose.startSession();

        //7.start transaction
        session.startTransaction();

        //8. create the user
        const user = await User.create(
            [{
                fullName,
                email,
                password:hashedPassword,
                role,
                phoneNumber
            }],
            {session}
        );

        //9. if a recruiter, create dummy company
        if(role==="recruiter"){
            const company = await Company.create(
                [{
                    companyName:"My company",
                    createdBy: user[0]._id
                }],
                {session}
            );
            user[0].company = company[0]._id;
            await user[0].save({session});
        }

        //commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        //create user session
        try {
            req.session.user = {
                userId : user[0]._id,
                role : user[0].role
            };
        }catch(err){
            return res.status(201).json({
                success:true,
                message:"Account Created Successfully. Please login again."
            })
        }

        return res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:{
                id: user[0]._id,
                fullName : user[0].fullName,
                email : user[0].email,
                role : user[0].role
            }
        })

    }catch(err){
        if(session){
            await session.abortTransaction();
            await session.endSession();
        }
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        });
    }

    
}


const login = async(req,res)=>{
    const {email,password} = req.body;
    //1. validate inputs are not empty
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Email and password must be required"
        });
    }

    try{
        //2.check user by email
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        //3.compare passwords
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        //4. create user session
        req.session.user = {
            userId: user._id,
            role : user.role
        }
        console.log("Session after login:",req.session);

        return res.status(200).json({
            success:true,
            message:"Login successful",
            user:{
                id:user._id,
                fullName:user.fullName,
                email:user.email,
                role:user.role
            }
        });
        
    }catch(err){
        //give other error messages
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal sever error"
        });
    }
    
}

const logout = async(req,res)=>{
    if(!req.session.user){
        return res.status(401).json({
            success:false,
            message:"No active session found"
        });
    }
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).json({
                success:false,
                message:"Logout failed",
                error:"Logout failed"
            });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({
            success:true,
            message:"Logged out successfully"
        });
    })
}

module.exports = {signup,login,logout};