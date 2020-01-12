const Exhibition = require('../../models/exhibition');

const exhibition = (req, res) => {
    Exhibition.find({}).sort( { "submit_date": -1 } ).exec((err, exhibitions)=>{
        if(err){
            console.log(err);
        }
        res.render('exhibition/exhibition_main', {exhibitions:exhibitions});
    });
};

const exhibitionDetail = (req, res) => {
    const exhibitionNum = req.params.id;
    Exhibition.findOne({_id:exhibitionNum}, (err, exhibition) => {
        if(err)
        {
            console.log(err);
        }
        res.render('exhibition/exhibition_detail', {exhibition:exhibition});
    });
};

module.exports = exhibition;
module.exports.exhibitionDetail = exhibitionDetail;