const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

//helper function to create cloudinary storage
const createStorage = (folderName,allowedFormats,resourceType)=>{
    return new CloudinaryStorage({
        cloudinary:cloudinary,
        params : {
            folder : folderName,
            allowed_formats : allowedFormats,
            resource_type:resourceType,
        },
    });
};

//storage configurations
const profilePhotoStorage = createStorage("profile_photos",["jpg","jpeg","png","webp"],"image");

const companyLogoStorage = createStorage("company_logos",["jpg","jpeg","png","webp"],"image");

const resumeStorage = createStorage("resumes",["pdf"],"raw");

//Multer middlewares
const uploadProfilePhoto = multer({
    storage:profilePhotoStorage,
    limits:{
        fileSize:5*1024*1024,   //5 MB
    },
});
const uploadCompanyLogo = multer({
    storage:companyLogoStorage,
    limits:{
        fileSize:5*1024*1024,   //5 MB
    },
});
const uploadResume = multer({
    storage:resumeStorage,
    limits:{
        fileSize:2*1024*1024,  //2MB
    },
});

module.exports = {uploadProfilePhoto,uploadCompanyLogo,uploadResume};
