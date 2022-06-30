var fs = require("fs");
var cloudinary = require("cloudinary").v2;
const { Router } = require("express");
const router = Router();
const multer = require("multer");
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


const storageImages = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function(req, file, cb) {
        const name = Date.now() + "." + file.mimetype.replace("image/", "");
        console.log("filename", name);
        cb(null, name);
    },
});

const uploadImage = multer({ storage: storageImages });

const upload_image = (req, res) => {
    console.log(req.file);
    //upload to cloudinary
    cloudinary.uploader.upload_large(req.file.path, function(error, result) {
        console.log(result, error);
        if (error) {
            removeFile(req.file.path); //remove file from folder
            return res.status(500).json({ success: false, error: error });
        } else {
            removeFile(req.file.path); //remove file from folder
            return res.status(201).json({ success: true, data: result.secure_url });
        }
    });
};

function removeFile(path) {
    try {
        fs.unlinkSync(path);
        //file removed
    } catch (err) {
        console.error(err);
    }
}


router.post(
    "/image",
    uploadImage.single("file"),
    upload_image
);


module.exports = router;