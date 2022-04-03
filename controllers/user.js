const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // If we have registered and we want to login immediately with our registration (Check Video No. 518)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Yelpcamp');
            res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!!!!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out');
    res.redirect('/campgrounds');
}