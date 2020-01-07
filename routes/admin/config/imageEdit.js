const sharp = require('sharp');

const imageEdit = async (fileAddress, fileName) => {
    const picRawAddress = './uploads/'+ fileAddress + 'Raw/' + fileName;
    const picAddress = './uploads/'+fileAddress+'/' + fileName;
    const watermarkAddress = './uploads/watermark/watermarkImage.png';
    const picThumbAddress = './uploads/'+fileAddress+'_300/' + fileName;
    const picWatermarkAddress = './uploads/'+fileAddress+'_watermark/' + fileName;
    return new Promise(async (resolve) => {
        await sharp(picRawAddress).rotate().toFile(picAddress).then(
            sharp(picRawAddress).metadata().then(metadata => {
                return sharp(watermarkAddress).resize(Math.round(metadata.width / 3)).webp().toBuffer();
            }).then(data => {
                sharp(picRawAddress).resize(630).rotate().toFile(picThumbAddress, (err) => {
                    if (err) resolve(null);
                    sharp(picRawAddress)
                        .composite([{input: data, gravity: 'center'}])
                        .jpeg({quality: 100}).rotate()
                        .toFile(picWatermarkAddress, (err) => {
                            if (err) resolve(null);
                        });
                });
            })
        );
        const pic=await sharp(picRawAddress).metadata().then(metadata => {
            return {
                width: metadata.width,
                height: metadata.height
            };
        });
        resolve(pic);
    });
};

module.exports = imageEdit;