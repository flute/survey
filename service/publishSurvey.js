var List = require('../models/list');

module.exports = function(req,callback){
    var id = req.params.id;
	List.publishSurveyById(id,function(result){
	    if( result.code == 1 ){
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
	});
}


