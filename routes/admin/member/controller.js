const Admin = require('../../../models/adminUser');
const passport = require('passport');
const fs = require('fs');

const member= (req, res) => {
    Admin.find((err, admin) => {
        if (err) console.log(err);
        res.render('admin/admin_member',{user:req.user,admin:admin});
    });
};

const memberSubmit= (req, res) => {
    res.render('admin/submit',{user:req.user});
};

const memberLogout= (req, res) => {
    req.logout();
    res.redirect('/admin/login');
};

const p_memberSubmit= (req, res, next) => {
    passport.authenticate('adminSignUp', err => {
        if (err) { console.log(err); return next(err); }
        res.redirect('/admin/member');
    })(req, res, next);
};

const d_memberDelete= (req, res) => {
    Admin.findOne({_id:req.body.id},(err,result) => {
        if (err) return res.send(err);
        fs.unlink(result.imageFace.picDestination+'/'+result.imageFace.picFilename, err => {
            if (err) throw err;
        });
        Admin.remove({_id:req.body.id}, err => {
            if (err) return res.send(err);
            return res.send('clear');
        });
    });
};

module.exports.member = member;
module.exports.memberSubmit = memberSubmit;
module.exports.memberLogout = memberLogout;
module.exports.p_memberSubmit = p_memberSubmit;
module.exports.d_memberDelete = d_memberDelete;