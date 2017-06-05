var express = require('express');
var router = express.Router();

var Create = require('../models/create'),
	moment = require('moment');

router.get('/',function(req, res){
    getCreatePage(req, res);
})

router.post('/',function(req, res){
    PostCreateData(req, res);
})
/**
 * 显示创建问卷页面
 */
function getCreatePage(req, res){
    res.render('create', {
        title: '创建问卷',
        user:req.session.user,
        tag:'create'
    });
}
/**
 * 创建问卷
 */
function PostCreateData(req, res){
    var data = req.body.data;
    data = JSON.parse(data);
    
    if( !data || data.title == '' || data.data.length <= 0  ){
        res.json({
            status:0,
            msg:'问卷选项不能为空'
        });
    }else{
        //插入问卷数据
        var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        var surveyData = {
            createdAt:datetime,
            updatedAt:datetime,
            adminId:req.session.user.id,
            name:req.session.user.name,
            code:req.session.user.currentRegion.code,
            title:data.title,
            data:data.data
        };
        Create.insertSurvey(surveyData,function(result){
            if( result.code == 200 ){                   
                var data = result.obj;
                var surveyId = result.data.insertId;
                //插入问卷成功,接着使用[async.eachSeries]按顺序批量插入问题及选项
                Create.insertQuestion({
                    surveyId:surveyId,
                    data:data
                },function(result){
                    console.log('插入完成');
                    console.log(result);
                    res.json(result);
                })
            }else{
                res.json(result);
            }
        }); 
    }
}

module.exports = router;