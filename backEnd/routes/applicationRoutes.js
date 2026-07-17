const express = require("express");
const router = express.Router();

const {isAuthenticated,isRecruiter,isCandidate}=require("../middleware/authMiddleWare");
const {applyJobById,getAllApplications,getApplicationsByJobId,updateStatus,getRecentApplications} = require("../controllers/applicationController");

//CANDIDATE APIS
router.post("/:jobId",isAuthenticated,isCandidate,applyJobById);
router.get("/myApplications",isAuthenticated,isCandidate,getAllApplications);

//RECRUITER APIS
router.get("/job/:jobId",isAuthenticated,isRecruiter,getApplicationsByJobId);
router.put("/:applicationId",isAuthenticated,isRecruiter,updateStatus);
router.get("/recent",isAuthenticated,isRecruiter,getRecentApplications);

module.exports = router;