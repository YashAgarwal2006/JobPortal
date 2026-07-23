const express = require("express");
const router = express.Router();

const {isAuthenticated,isRecruiter,isCandidate}=require("../middleware/authMiddleWare");
const {applyJobById,getAllApplications,getApplicationsByJobId,updateStatus,getRecentApplications,checkApplicationStatus} = require("../controllers/applicationController");
const {uploadResume} = require("../middleware/upload")

//CANDIDATE APIS
router.post("/:jobId",isAuthenticated,isCandidate,uploadResume.single("resume"),applyJobById);
router.get("/myApplications",isAuthenticated,isCandidate,getAllApplications);
router.get("/check/:jobId",isAuthenticated,isCandidate,checkApplicationStatus);
//RECRUITER APIS
router.get("/job/:jobId",isAuthenticated,isRecruiter,getApplicationsByJobId);
router.put("/:applicationId",isAuthenticated,isRecruiter,updateStatus);
router.get("/recent",isAuthenticated,isRecruiter,getRecentApplications);

module.exports = router;