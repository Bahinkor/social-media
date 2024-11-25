const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.multerStorage = (destination, allowedTypes = /jpeg|jpg|png|webp/) => {
    // create the destination directory if is doesn't exist
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }

    // multer configs
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },

        filename: (req, file, cb) => {
            const unique = Date.now() * Math.floor(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `${unique}${ext}`);
        },
    });

    const fileFilter = (req, file, cb) => {
        // allow extension
        if (allowedTypes.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."));
        }
    };

    const uploader = multer({
        storage,
        limits: {
            fileSize: 512_000_000 // 5MB
        },
        fileFilter,
    });

    return uploader;
};