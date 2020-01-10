const User = require('../../../models/user');

const user = (req, res) => {
    User.find((err, users) => {
        if (err) console.log(err);
        res.render('admin/user', {users: users,user:req.user});
    });
};

const userPermissionSeller = (req, res) => {
    User.find({isSignUpSeller:true, isSeller:false}, (err, users) => {
        if (err) console.log(err);
        res.render('admin/user_permissionSeller', {users: users,user:req.user});
    });
};

const p_userPermissionSeller = (req, res) => {
    const userNum = req.body.id;
    User.findOne({_id:userNum}, (err, user) => {
        if(err) return res.send(err);
        if(!user) return res.send("not found user");
        User.updateOne({_id:userNum}, {$set:{isSeller:true}}, err => {
            if(err) return res.send(err);
            res.send("clear");
        });
    });
};

module.exports.user = user;
module.exports.userPermissionSeller = userPermissionSeller;
module.exports.p_userPermissionSeller = p_userPermissionSeller;