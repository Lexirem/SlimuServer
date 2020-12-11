const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const uploadCloud = require('../configs/cloudinary-setup');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

const uploader = require("../configs/cloudinary-setup")

router.post("/", uploader.single("image"), (req,res,next) =>{
    if(!req.file){
        next(new Error("No file uploaded"));
        return;
    }
    res.json({secure_url:req.file.secure_url});
});

module.exports=router;