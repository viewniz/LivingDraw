const passport = require('passport');

module.exports = (req, res) => {
    res.render('admin/index',{user:req.user});
};

module.exports.login= (req, res) => {
    res.render('admin/login');
};

module.exports.p_login= (req, res, next) => {
    passport.authenticate('adminLogin', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {res.send(info.error); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect("/admin/border");
        });
    })(req, res, next);
};