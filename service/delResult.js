var Result = require('../models/result');

module.exports = function(req,callback){

	var id = req.params.id;
    	
	Result.delResultById(id,function(result){
		if( result.fieldCount == 0 ){
			var data = {
				status:1,
				msg:'success',
				data:id
			};
		}else{
			var data = {
				status:0,
				msg:'failed',
				data:id
			};
		}
		callback(data);
	})
}



