var Result = require('../models/result'),
	List = require('../models/list');

module.exports = function(req,callback){

    var id = req.params.id;
	//取该答卷结果
	Result.getResultById(id,function(result){
		if( result.code == 200 ){
			var surveyId = result.surveyId;
			//取问卷
			List.getSurveyById(surveyId,function(survey){
	    		if(survey){
                    // 处理数据，得到分析结果
	    			survey = dealResult(result,survey);
	    			var data = {
	    				status:1,
	    				msg:'success',
	    				result:survey
	    			}
	    		}else{
	    			var data = {
	    				status:0,
	    				msg:'failed',
	    				result:[]
	    			}
	    		}
	    		callback(data);
	    	})
		}else{
			var data = {
				status:0,
				msg:'failed',
				result:[]
			}
			callback(data);
		}
	})
}

function dealResult(result,survey){
    
    var question = survey.question;
    survey.question = [];
    for( var i in question ){
        survey.question.push( question[i] );
    }

    for( var i=0;i<survey.question.length;i++ ){
        for( var j=0;j<result.result.length;j++ ){
            if( survey.question[i].id == result.result[j].questionId ){
                
                //单选
                if( survey.question[i].type == 1 ){
                    if( result.result[j].type == 'other' ){
                        survey.question[i].otherResult = result.result[j].content;
                    }else if( result.result[j].type == 'radio' ){
                        for( var z=0;z<survey.question[i].option.length;z++ ){
                            if( survey.question[i].option[z].id == result.result[j].optionId ){
                                survey.question[i].option[z].checked = true;
                            }
                        }
                    }	
                }
                //多选
                if( survey.question[i].type == 2 ){
                    if( result.result[j].type == 'other' ){
                        survey.question[i].otherResult = result.result[j].content;
                    }else if( result.result[j].type == 'checkbox' ){
                        for( var z=0;z<survey.question[i].option.length;z++ ){
                            if( survey.question[i].option[z].id == result.result[j].optionId ){
                                survey.question[i].option[z].checked = true;
                            }
                        }
                    }	
                }
                //问答
                if( survey.question[i].type == 3 ){
                    survey.question[i].result = result.result[j].content;
                }

            }
        }
    }
    return survey;
}

