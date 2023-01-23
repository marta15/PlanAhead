const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');


router.get('/register', (req, res) => {
    res.render('users/register');
});
router.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to PlanAhead!');
            res.redirect('/plans');
        });

    } catch (e) {
        req.flash('error', `${e.message}, please try again`);
        res.redirect('/register');
    }

}));
router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: './login', keepSessionInfo: true }), (req, res) => {
    const redirectUrl = req.session.returnTo || '/plans';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});
router.get('/logout', (req, res, next) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");
    });
    //res.redirect('/home');
});

module.exports = router;