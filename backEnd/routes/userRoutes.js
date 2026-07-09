const express = require("express");
const router = express.Router();

const {isAuthenticated,isRecruiter,isCandidate} = require("../middleware/authMiddleWare");
const {getMyProfile,updateProfile,updateProfilePhoto,updateResume} = require("../controllers/userController");
const {uploadProfilePhoto,uploadResume} = require("../middleware/upload");
router.get("/profile",isAuthenticated,getMyProfile);

router.put("/profile",isAuthenticated,updateProfile);
router.put("/profile/photo",isAuthenticated,uploadProfilePhoto.single("profilePhoto"),updateProfilePhoto);

router.put("/profile/resume",isAuthenticated,uploadResume.single("resume"),updateResume);

//more routes to add in future

module.exports = router;
