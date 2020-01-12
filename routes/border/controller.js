const Border = require('../../models/border');
const Options = require('../../models/options');

const borderSort = async (skipNum, listOut, sortBased, sortAD) => {
    let sortingData = {};
    sortingData[sortBased] = !sortAD ? -1 : parseInt(sortAD); //sortAD값 없으면 내림차순으로 정렬
    return new Promise(async (resolve) => {
        Border.find({}).skip(skipNum).limit(listOut).sort(sortingData).exec( (err, border) => {
            if(err)
                return resolve(err);
            return resolve(border);
        });
    });
};

const borderOutOfBounds = (req, res) =>{
    res.redirect('/border/1');
};

const borderMain = async (req, res) => {
    const listOut = 10; //한 페이지에 출력될 게시물 수
    const countPage = 10; //한 화면에 출력될 페이지 수
    const prePage = parseInt(req.params.id);
    if (prePage < 1) {
        res.redirect('/border/1');
    }
    const borderTotal = await Border.countDocuments((err, result) => {
        if(err) {
            console.log(err);
            return res.redirect('/');
        }
        return result;
    }); //총 게시물 수
    const totalList = (borderTotal % listOut > 0) ?
        parseInt(borderTotal / listOut) + 1 : parseInt(borderTotal / listOut); // 총 페이지 수
    if (prePage > totalList) {
        return res.redirect('/border/' + totalList);
    }
    const skipNum = (prePage - 1) * listOut;
    const startPage = parseInt((prePage - 1) / countPage) * countPage + 1; //프론트 표기 start page
    const endPage = (startPage + countPage - 1) > totalList ? totalList : startPage + countPage - 1; //프론트 표기 end page
    const sortQuery = req.query.sort; //get sort 값
    let border;
    switch (sortQuery) {
        case 'old': //등록 오래된 순
            border = await borderSort(skipNum,listOut,"submit_date",1);
            break;
        case 'new': //등록 최신 순
            border = await borderSort(skipNum,listOut,"submit_date",-1);
            break;
        case 'high': //가격 비싼 순
            border = await borderSort(skipNum,listOut,"price",-1);
            break;
        case 'low': // 가격 낮은 순
            border = await borderSort(skipNum,listOut,"price",1);
            break;
        default: //기본 최신 순으로 해둠
            border = await borderSort(skipNum,listOut,"submit_date",-1);
            break;
    }
    res.render('border/border_detail', {
        border: border,
        startPage: startPage,
        endPage: endPage,
        borderTotal: borderTotal,
        prePage: prePage,
        totalList: totalList,
        sort: '?sort=' + sortQuery
    });
};

const productDetail = async (req, res) => {
    const borderNum = req.params.id;
    try{
        const subject = await Options.find({type:'subject'},(err, result)=>{if(err) throw err; return result;});
        const material = await Options.find({type:'material'},(err, result)=>{if(err) throw err; return result;});
        const style = await Options.find({type:'style'},(err, result)=>{if(err) throw err; return result;});
        const medium = await Options.find({type:'medium'},(err, result)=>{if(err) throw err; return result;});
        Border.findOne({_id: borderNum}, (err, border) => {
            Border.updateOne({_id:borderNum}, { $inc: { view: 1} });
            if(err) throw err;
            res.render('border/product', {border: border,subject:subject,style:style,medium:medium,material:material});
        });
    }catch(err){
        res.redirect('/border/1');
    }
};

module.exports.borderOutOfBounds = borderOutOfBounds;
module.exports.borderMain = borderMain;
module.exports.productDetail = productDetail;