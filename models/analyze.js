var mysql = require('../service/mysql');
//async
var async = require('async');
//时间转换组件
var moment = require('moment');

module.exports = {
	getResultData:function(surveyId,callback){

		mysql(function(err, connection){
			if( err ){
				callback({
					code:0,
					msg:err
				});
				return;
			}
			
			var arr={};
			connection.query("select * from t_survey_result where surveyId="+surveyId,function(error,result){

				if( result&&result.length>0 ){
					arr.count = result.length;
					async.eachSeries(result,function(resitem, rescb){
						console.log('resitem:'+resitem.id);
						var resultOption = resitem.resultOptionId.split(',');
						async.eachSeries( resultOption, function(item,cb){
							console.log('resultOption:'+item);
							connection.query("select * from t_survey_result_option where id="+item, function(rerr,rres){
								if(rres){
									var questionId = rres[0].questionId,
										optionId = rres[0].optionId;
									console.log('questionId:'+questionId+' - optionId:'+optionId);

									arr[questionId] = arr[questionId] ? arr[questionId] : {};
									arr[questionId][optionId] = arr[questionId][optionId] ? arr[questionId][optionId]+1 : 1;
									
								}
								cb(rerr,rres);
							})
						},function(e){
							if(e){
								rescb(e);
							}else{
								rescb();
							}
						})
					},function(e){
						if(e){
							callback({
								code:0,
								msg:e
							});
						}else{
							callback({
								code:1,
								msg:'success',
								arr:arr
							});
						}
					})
				}else{
					callback({
						code:0,
						msg:'结果为空'
					});
				}
				connection.release();
			})
		})
	}
}