// upload
var formidable = require('formidable');

module.exports = function(req, res){

    var form = new formidable.IncomingForm();

    form.encoding = "utf-8";        //设置编辑
    form.uploadDir = "./public/uploads";   //设置上传目录
    form.keepExtensions = true;     //保留后缀
    //form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json({
                status:0,
                mag:'failed',
                data:err
            });
            return;       
        } 
        var extName = '';  //后缀名
        switch (files.file.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;       
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;       
        }

        if(extName.length == 0){
            res.json({
                status:2,
                msg:'只支持png和jpg格式图片',
            }); 
            return;                 
        }

        var u= files.file.path.slice(6);
        var imgUrl = req.protocol+"://"+req.headers.host+u;
        res.json({
            status:1,
            msg:'success',
            imgUrl:imgUrl
        });
    });
}