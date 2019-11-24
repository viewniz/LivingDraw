const Exhibition = require('../../models/exhibition');

exports.exhibition_main= function(req, res, next) {
    Exhibition.find({}, (err, exhibitions)=>{
        if(err){
            console.log(err);
        }
        res.render('exhibition/exhibition_main',{exhibitions:exhibitions});
    });
};

exports.exhibition_detail= function(req, res, next) {
    const exhibitionNum = req.params.id;
    Exhibition.findOne({_id:exhibitionNum}, (err, exhibition) => {
        if(err)
        {
            console.log(err);
        }
        res.render('exhibition/exhibition_detail',{exhibition:exhibition});
    });
};

