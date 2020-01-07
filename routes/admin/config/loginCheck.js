module.exports = (req,res,next) => {         //구매자 등록페이지 들어갈 때 검사
    if(!req.user)
    {
        res.redirect('/admin/login');
    }
    else if(!req.user.isAdmin)
    {
        req.logout();
        res.redirect('/admin/login');
    }
    else
    {
        return next();
    }
};