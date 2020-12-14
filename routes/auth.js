const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//  POST '/signup'

router.post("/signup",
  // isNotLoggedIn(),
    
  // validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const emailExists = await User.findOne({email}, "email");
	
      if (emailExists) return next(createError(400, "email already exists"));
    
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        
		    const newUser = await User.create({ email, password: hashPass})
        
        req.session.currentUser = newUser;
        res
            .status(200)
            .json(newUser)
      } 
    } catch (error) {
      next(error);
    }
  }
);


//  POST '/login'

router.post("/login",
  // isNotLoggedIn(),
    
  // validationLoggin(),
    async (req, res, next) => {
      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        
        if (!user) {
          next(createError(404));
        }
        // si el usuario existe, hace hash del password y lo compara con el de la BD
        // loguea al usuario asignando el document a req.session.currentUser, y devuelve un json con el user
        else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.status(200).json(user);
          return;
        } else {
          next(createError(401, "email or password incorrect"));
        }
      } catch (error) {
        next(error);
      }
    }
);

// POST '/logout'

router.post("/logout",  (req, res, next) => {          
  req.session.destroy();
  res
    .status(204) 
    .send();
  return;
});


// GET '/private'   --> Only for testing

router.get("/private", (req, res, next) => {
  res
    .status(200) 
    .json({ message: "Test - User is logged in" });
});


// GET '/me'

router.get("/me",  (req, res, next) => {
  req.session.currentUser.password = "*";
  res.json(req.session.currentUser);
});

module.exports = router;