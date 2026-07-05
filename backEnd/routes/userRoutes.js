const express = require("express");
const router = express.Router();

const {isAuthenticated,isRecruiter,isCandidate} = require("../middleware/authMiddleWare");
const {getMyProfile,updateProfile} = require("../controllers/userController");

router.get("/me",isAuthenticated,getMyProfile);

router.put("/profile",isAuthenticated,updateProfile);

//more routes to add in future

module.exports = router;
