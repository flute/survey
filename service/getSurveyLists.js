var List = require('../models/list'),
	moment = require('moment');

module.exports = function(req,callback){
	
    var page = req.query.page,
        title = req.query.title,
        username = req.query.name,
        code = req.session.user.currentRegion.code;

    title = title==''?null:title;
    username = username==''?null:username;

    var pageUrl = req.protocol+"://"+req.headers.host+req.path;
	List.getAllSurvey(code,page,title,username,function(result){
		if( result.code == 200 ){
			for( var i=0;i<result.result.length;i++ ){
				var createdAt = moment( result.result[i].createdAt ).format('YYYY-MM-DD HH:mm:ss');
				var updatedAt = moment( result.result[i].updatedAt ).format('YYYY-MM-DD HH:mm:ss');
				result.result[i].createdAt = createdAt;
				result.result[i].updatedAt = updatedAt;
			}
			console.log(result);
			var datas = {
				title:'查看问卷',
				user:req.session.user,
				status:1,
				tag:'list',
				msg:'success',
				currentPage:page,
				totalPages:Math.ceil( result.count/10 ),
                pageUrl:pageUrl,
                username:username,
                stitle:title,
				data:result.result
			};
			callback(null,datas);
		}else{
			var datas = {
				title:'查看问卷',
				user:req.session.user,
				status:0,
				tag:'list',
				msg:'failed',
				data:result.result,
				errorDesc:'系统异常'
			};
			callback('系统异常',datas);
		}
		
	})
}