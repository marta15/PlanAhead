const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(wrapAsync(users.register));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: './login', keepSessionInfo: true }), users.login);

router.get('/logout', users.logout);

module.exports = router;