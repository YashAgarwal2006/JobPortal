const express = require("express");
const router = express.Router();

const {isAuthenticated,isRecruiter} = require("../middleware/authMiddleWare");
const {uploadCompanyLogo} = require("../middleware/upload");

const {createCompany,getMyCompany,updateCompanyProfile,toggleStatus,deleteCompany,updateCompanyLogo} = require("../controllers/companyController");

router.post("/",isAuthenticated,isRecruiter,createCompany);
router.get("/profile",isAuthenticated,isRecruiter,getMyCompany);
router.put("/profile",isAuthenticated,isRecruiter,updateCompanyProfile);
router.put(
    "/:companyId/logo",
    isAuthenticated,
    isRecruiter,
    uploadCompanyLogo.single("companyLogo"),
    updateCompanyLogo
);
router.patch("/status",isAuthenticated,isRecruiter,toggleStatus);
router.delete("/:companyId",isAuthenticated,isRecruiter,deleteCompany);
module.exports = router;