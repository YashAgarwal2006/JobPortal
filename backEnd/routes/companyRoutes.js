const express = require("express");
const router = express.Router();

const {isAuthenticated,isRecruiter} = require("../middleware/authMiddleWare");

const {getMyCompany,updateCompanyProfile,toggleStatus} = require("../controllers/companyController");
router.get("/me",isAuthenticated,isRecruiter,getMyCompany);
router.put("/profile",isAuthenticated,isRecruiter,updateCompanyProfile);
router.patch("/status",isAuthenticated,isRecruiter,toggleStatus);
module.exports = router;