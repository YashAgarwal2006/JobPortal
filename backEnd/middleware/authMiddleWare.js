const isAuthenticated=(req,res,next)=>{
    console.log("Reached isAuthenticated");
    if(!req.session.user){
        return res.status(401).json({
            success:false,
            message:"Authentication required"
        });
    }
    req.user = req.session.user;
    next();
}

const isRecruiter=(req,res,next)=>{
    console.log("Reached isRecruiter");
    if(req.user.role !== "recruiter"){
        return res.status(403).json({
            success:false,
            message:"Only recruiters are allowed to access"
        });
    }
    next();
}

const isCandidate=(req,res,next)=>{
    if(req.user.role !== "candidate"){
        return res.status(403).json({
            success:false,
            message:"Only candidates are allowed to access"
        });
    }
    next();
}

module.exports = {isAuthenticated,isRecruiter,isCandidate};