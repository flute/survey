var List = require('../models/list');

module.exports = function(req,callback){

    var id = req.params.id,
    	terminal = req.params.terminal;

	terminal = terminal==''?'web':terminal;

	List.getSurveyById(id,function(result){
		
		if(result){
			var question = result.question;
			result.question = [];
			for( var i in question ){
				result.question.push( question[i] );
			}
			var data = {
	            terminal:terminal,
	            result:result
	        };
	        callback(null,data)
		}else{
			var data = {
	            terminal:terminal,
	            result:[]
	        };
			callback('查询失败')
		}
	})
}



