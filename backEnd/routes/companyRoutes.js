const express = require("express");
const router = express.Router();

const {isAuthenticated,isRecruiter} = require("../middleware/authMiddleWare");

const {getMyCompany,updateCompanyProfile,toggleStatus,deleteCompany} = require("../controllers/companyController");
router.get("/me",isAuthenticated,isRecruiter,getMyCompany);
router.put("/profile",isAuthenticated,isRecruiter,updateCompanyProfile);
router.patch("/status",isAuthenticated,isRecruiter,toggleStatus);
router.delete("/:companyId",isAuthenticated,isRecruiter,deleteCompany);
module.exports = router;