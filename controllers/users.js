const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
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

};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/plans';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");
    });
};