var mysql = require('mysql');
var conf = require('../conf/db.js');
//使用连接池，提升性能
var pool = mysql.createPool( conf.mysql );
//async
var async = require('async');
//时间转换组件
var moment = require('moment');

module.exports = {
	getAllSurvey : function(page,callback){
		pool.getConnection(function(err,connection){
			if(err){
				callback(err);
				return;
			}
			if( page<=0 ){
				var startNumber = 0;
			}else{
				var startNumber = (page-1)*10;
			}
			connection.query("select * from t_survey limit "+startNumber+",10",function(error,result){
				if(result){
					connection.query("select id from t_survey",function(err,res){
						if( res ){
							callback({
								code:200,
								msg:'success',
								result:result,
								count:res.length
							});
						}else{
							callback({
								code:0,
								msg:'failed',
								result:error
							});
						}
					})
				}else if(error){
					callback({
						code:0,
						msg:'failed',
						result:error
					});
				}
				//释放连接 
	            connection.release();
			})
		})
	},
	getSurveyById:function(id,callback){
		pool.getConnection(function(err,connection){
			if( err ){
				callback(err);
				return;
			}
			connection.query("select * from t_survey where id="+id,function(error,result){
				if( result ){
					var surveyId = result[0].id;
					console.log('问卷存在：'+surveyId);
					var survey = {};
					survey.id = surveyId;
					survey.title = result[0].title;
					survey.question = {};
					connection.query("select * from t_survey_question where surveyId="+surveyId,function(e,re){
						if( re ){
							console.log(re);

							if( re.length > 0 ){
								//创建查询选项sql,异步列队查询
								var selectOptionSql = [];
								for(var i=0;i<re.length;i++){
									var questionId = re[i].id;
									survey.question[questionId] = {};
									survey.question[questionId].id = questionId;
									survey.question[questionId].title = re[i].title;
									survey.question[questionId].type = re[i].type;
									if( re[i].type == 1 || re[i].type == 2 ){
										survey.question[questionId].other = re[i].other;
										var questionId = re[i].id;
										var sql = "select * from t_survey_option where questionId="+questionId;
										selectOptionSql.push( sql );
									}
								}
								console.log(selectOptionSql);
								var options = {};
								async.eachSeries( selectOptionSql, function(item,cb){
									connection.query(item,function(operr,opresult){
										/*if(operror){
											cb(operror,opresult);
										}else{
											//选项插入成功
											console.log('选项插入成功：'+ opresult.insertId +' 所属问题ID：'+questionId );
											optioncb();
										}*/
										console.log(opresult);
										if(opresult){
											var qid = opresult[0].questionId;
											options[qid] = opresult;
											survey.question[qid].option = opresult;
										}
										cb(operr,opresult);
									})
								},function(err,results){
									//单选遍历完毕
									console.log('单选遍历完毕');
									console.log(survey);
									callback(survey);
									connection.release();
								});	
							}else{
								//没数据呀
							}
						}else if( e ){
							console.log(e);
						}
					})
				}else if( error ){
					console.log(error);
				}
			})
		})
	},
	delSurveyById:function(id,callback){
		pool.getConnection(function(err,connection){
			if( err ){
				callback(err);
				return;
			}
			connection.query("delete from t_survey where id="+id,function(error,result){
				if( result ){
					console.log(result);
					callback(result);
				}else if(error){
					callback(error);
				}
				connection.release();
			})
		})
	},
	saveAnswer:function(data,callback){
		var surveyId = data.surveyId;
		var data = data.data;

		pool.getConnection(function(err,connection){
			if( err ){
				callback(err);
				return;
			}
			var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
			var answers = [];
			async.eachSeries( data, function(item,cb){
				if( item.type == 'radio' || item.type == 'checkbox' ){
					var content = '';
					var optionId = item.optionId
				}else{
					var content = item.content;
					var optionId = 0;
				}
				connection.query("insert into t_survey_result_option(type,createdAt,questionId,optionId,content) values('"+item.type+"','"+datetime+"','"+item.questionId+"','"+optionId+"','"+content+"')",function(error,result){
					if( result ){
						console.log('插入答案成功：'+result.insertId);
						answers.push(result.insertId);
					}
					cb(error,result);
				})
			},function(e){
				if(e){
					callback(e);
				}else{
					console.log(answers);
					answers = answers.join(',');
					connection.query("insert into t_survey_result(createdAt,userId,surveyId,resultOptionId) values('"+datetime+"','6','"+surveyId+"','"+answers+"')",function(er,re){
						if(re){
							console.log('插入成功：'+re.insertId);
							callback({
								code:200,
								data:re.insertId
							});
							connection.release();
						}else if(er){
							callback(er);
						}
					})
				}
			});
			
		})
	}
}