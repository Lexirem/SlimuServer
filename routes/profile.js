const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');


router.get('/:id', async(req, res, next) => {
   let myUser = await User.findById(req.params.id);
   try{
    res.json(myUser);
   } catch (err){
    console.log(err);
   }
});

