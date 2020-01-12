const fs = require('fs');

const imageRemove = (fileFieldName, fileName) => {
    const picRawAddress = './uploads/'+ fileFieldName + 'Raw/' + fileName;
    const picAddress = './uploads/'+fileFieldName+'/' + fileName;
    const picThumbAddress = './uploads/'+fileFieldName+'_300/' + fileName;
    const picWatermarkAddress = './uploads/'+fileFieldName+'_watermark/' + fileName;
    fs.stat(picWatermarkAddress, (err) => {
        if(err == null) {
            fs.unlink(picWatermarkAddress, (err) => {
                if (err) throw err;
            });
        }
        console.log(err);
    });
    fs.stat(picThumbAddress, (err) => {
        if(err == null) {
            fs.unlink(picThumbAddress, (err) => {
                if (err) throw err;
            });
        }
    });
    fs.stat(picAddress, (err) => {
        if(err == null) {
            fs.unlink(picAddress, (err) => {
                if (err) throw err;
            });
        }
    });
    fs.stat(picRawAddress, (err) => {
        if(err == null) {
            fs.unlink(picRawAddress, (err) => {
                if (err) throw err;
            });
        }
    });
};

module.exports = imageRemove;