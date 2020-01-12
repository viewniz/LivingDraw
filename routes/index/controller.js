const Border = require("../../models/border");
module.exports = (req, res) => {
    const listOut = 8;
    const sortingData = {"submit_date":-1};
    Border.find({}).limit(listOut).sort(sortingData).exec( (err, border) => {
        res.render('index/index',{border:border});
    });
};