var List = require('../models/list');

module.exports = function(req,callback){

	var surveyId = req.params.id,
		data = req.body.data,
		userId = req.body.userId;
		
	data = JSON.parse(data);
	var datas = {
		surveyId:surveyId,
		data:data,
	    userId:userId
	};
	console.info('datas：',datas)	
	List.saveAnswer(datas,function(result){

		if( result.code == 200 ){
			var data = {
				status:1,
				msg:'success',
				data:result.data
			};
		}else{
			var data = {
				status:0,
				msg:'failed',
				data:result.data
			};
		}
		callback(data)
	})
}



