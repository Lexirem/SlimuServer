const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require("mongoose");
const uploadCloud = require('../configs/cloudinary-setup');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

//ruta profile
router.get('/:id', async(req, res, next) => {
   let myUser = await User.findById(req.params.id);
   try{
    res.json(myUser);
   } catch (err){
    console.log(err);
   }
});

router.put('/:id/edit', (req, res, next) => {
   User.findByIdAndUpdate(
      req.params.id ,
      {
         username: req.body.username,
         email: req.body.email,
         image: req.body.image,
      },
      {new: true }
   )
   .then( (updateProfile) => {
      res.locals.currentUserInfo = updateProfile;
      res.status(200).json(updateProfile);
   })
   .catch((error) => {
      console.log(error);
   });
});

router.post("/favorites/:id", (req, res, next) => {
   let { image, name } = req.body;
   console.log(req.body)
   User.findByIdAndUpdate(
      req.params.id,{
         $push: {myAnime: {image, name}}
      }
   )
   .then((updateProfile) => {
      res.status(200).json(updateProfile)
   })
   .catch((error) =>{
      console.log(error)
   });
});

router.put("/favorites/:id", (req, res, next) => {
   console.log(req.body)
   let { image, name, _id } = req.body;
   User.findByIdAndUpdate(
      req.params.id,{
         $pull: {myAnime: {_id}}
      }
   )
   .then((updateProfile) => {
      res.status(200).json(updateProfile)
   })
   .catch((error) => {
      console.log(error)
   });
});



module.exports = router;