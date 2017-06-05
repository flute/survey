var Result = require('../models/result'),
	moment = require('moment');

module.exports = function(req,callback){

    var id = req.params.id,
        page = req.query.page,
        name = req.query.name,
        time = req.query.time,
        sort = req.query.sort;

    name = name==''?null:name;
    time = time==''?null:time;
    sort = sort==''?null:sort;

    var pageUrl = req.protocol+"://"+req.headers.host+req.path;
	Result.getResult(page,id,name,time,sort,function(result){
		if( result.code == 200 ){
            
			for( var i=0;i<result.result.length;i++ ){
				var createdAt = moment( result.result[i].createdAt ).format('YYYY-MM-DD HH:mm:ss');
				var updatedAt = moment( result.result[i].updatedAt ).format('YYYY-MM-DD HH:mm:ss');
				result.result[i].createdAt = createdAt;
				result.result[i].updatedAt = updatedAt;
			}
			var data = {
					title:'问卷结果',
					user:req.session.user,
    				status:1,
    				tag:'list',
    				msg:'success',
    				currentPage:page,
    				totalPages:Math.ceil( result.count/10 ),
                    pageUrl:pageUrl,
                    name:name,
                    time:time,
                    sort:sort,
    				data:result.result
    			};
		}else{
			var data = {
					title:'问卷结果',
					user:req.session.user,
    				status:0,
    				tag:'list',
    				msg:'failed',
    				data:result.result
    			};
		}
		callback(data);
	})
}



