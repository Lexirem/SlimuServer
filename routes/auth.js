const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/user');

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//  POST '/signup'

router.post('/signup',
  
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // chequea si el username ya existe en la BD
      const usernameExists = await User.findOne({ email}, 'email');
      // si el usuario ya existe, pasa el error a middleware error usando next()
      if (usernameExists) return next(createError(400));
      else {
        // en caso contratio, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const newUser = await User.create({ email, password: hashPass});
        // luego asignamos el nuevo documento user a req.session.currentUser y luego enviamos la respuesta en json
        req.session.currentUser = newUser;
        res
          .status(200) //  OK
          .json(newUser);
      }
    } catch (error) {
      next(error);
    }
  }
);


//LOGIN POST
router.post('/login',
  //isNotLoggedIn(),
  //validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // revisa si el usuario existe en la BD
      const user = await User.findOne({ email });
      
      // si el usuario no existe, pasa el error al middleware error usando next()
      if (!user) {
        next(createError(404));
      }
      // si el usuario existe, hace hash del password y lo compara con el de la BD
      // loguea al usuario asignando el document a req.session.currentUser, y devuelve un json con el user
      else if (bcrypt.compareSync(password, user.password,)) {
        console.log(user, 'ser')
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  });

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






