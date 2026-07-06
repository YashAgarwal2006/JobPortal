const express = require("express");
const router = express.Router();

const {isAuthenticated,isRecruiter} = require("../middleware/authMiddleWare");
const {postJob,getMyJobs,getJobById,updateJobById,deleteJobById} = require("../controllers/jobController");

//recruiter APIs
router.post("/",isAuthenticated,isRecruiter,postJob);
router.get("/myJobs",isAuthenticated,isRecruiter,getMyJobs);
router.put("/:id",isAuthenticated,isRecruiter,updateJobById);
router.delete("/:id",isAuthenticated,isRecruiter,deleteJobById);

//public apis
router.get("/:id",getJobById);

module.exports = router;