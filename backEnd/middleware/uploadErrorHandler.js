const multer = require("multer");

const uploadErrorHandler = (err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        switch (err.code) {

            case "LIMIT_FILE_SIZE":

                if (req.uploadType === "resume") {
                    return res.status(400).json({
                        success: false,
                        message: "Resume size cannot exceed 2 MB."
                    });
                }

                if (req.uploadType === "profilePhoto") {
                    return res.status(400).json({
                        success: false,
                        message: "Profile photo size cannot exceed 5 MB."
                    });
                }

                if (req.uploadType === "companyLogo") {
                    return res.status(400).json({
                        success: false,
                        message: "Company logo size cannot exceed 5 MB."
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: "Uploaded file is too large."
                });

            default:

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
        }
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    next();
};

module.exports = uploadErrorHandler;