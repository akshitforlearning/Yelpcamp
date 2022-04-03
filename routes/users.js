const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser)
// passport.authenticate() as a middleware below will do all the work of adding a validation and dispaying an error message and also it does what bcrypt.compare() is used to doing for us

router.get('/logout', users.logoutUser)

module.exports = router;