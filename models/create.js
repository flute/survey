var mysql = require('mysql');
var conf = require('../conf/db.js');
var sql = require('./createModel.js');
//async
var async = require('async');
//时间转换组件
var moment = require('moment');
//使用连接池，提升性能
var pool = mysql.createPool( conf.mysql );

module.exports = {
	insertSurvey: function (req,callback) {
		pool.getConnection(function(err,connection){
			if( err ){
				callback(err);
				return;
			}
			connection.query( sql.insertSurvey,[req.createdAt, req.updatedAt, req.adminId, req.title], function(err,res){
				if(res){
					console.log('问卷插入成功：'+res.insertId);
					var result = {
	                    code: 200,
	                    msg: '成功',
	                    data:res,
	                    obj:req.data
	                };
				}else if(err){
					var result = {
	                    code: 0,
	                    msg: 'faild',
	                    data:err,
	                    obj:req.data
	                };
				}
				//回调结果
				callback(result);
				//释放连接 
	            connection.release();
			})
		})
	},
	insertQuestion:function(req,questioncb){
		var data = req.data;
		var surveyId = req.surveyId;
		var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
		//插入问题sql语句数组
		var insertQuestionSql = [];
		for( var i=0;i<data.length;i++ ){
			//type
			if( data[i].type == 'radio' ){
				var type = 1,
					other = data[i].others ? 1 : 0;
			}else if( data[i].type == 'checkbox' ){
				var type = 2,
					other = data[i].others ? 1 : 0;
			}else if( data[i].type == 'text' ){
				var type = 3,
					other = 0;
			}
			insertQuestionSql.push({
				survey:"insert into t_survey_question(createdAt, updatedAt, surveyId, title, type, other) values('"+datetime+"','"+datetime+"','"+surveyId+"','"+data[i].title+"','"+type+"','"+other+"')",
				data:data[i]
			})    					
		}
		
		if( insertQuestionSql && insertQuestionSql.length>0 ){

			pool.getConnection(function(err,connection){
				if( err ){
					questioncb(err);
					return;
				}
				async.eachSeries( insertQuestionSql, function(item,callback){
					//遍历插入问题每条SQL并执行
					connection.query( item.survey, function(err, results) {
						//console.log(item.survey);
						if(err) {
							//异常后调用callback并传入err
							callback(err,result);
							//console.log(err);
						}else{
							//插入问题成功后得到问题ID，继续插入选项
							var questionId = results.insertId;
							console.log("问题插入成功："+questionId);
							
							//拼接插入选项的sql，使用异步插入
							if( item.data.type == 'radio' || item.data.type == 'checkbox' ){
								//存在选项
								var insertOptionSql = [];

								for( var j=0;j<item.data.options.length;j++ ){
									var option = item.data.options[j];
									sql = "insert into t_survey_option(createdAt, updatedAt, questionId, content) values('"+datetime+"','"+datetime+"','"+questionId+"','"+option+"')";
									insertOptionSql.push(sql);
								}

								//异步顺序插入选项
								async.eachSeries( insertOptionSql, function( optionitem, optioncb ){
									connection.query( optionitem, function( operror,opresult){
										if(operror){
											optioncb(operror,opresult);
										}else{
											//选项插入成功
											console.log('选项插入成功：'+ opresult.insertId +' 所属问题ID：'+questionId );
											optioncb();
										}
									});
								},function(err){
									//console.log('选项插入完毕');
									if(err){
										console.log("err: " + err);
										callback(err);
									}else{
										console.log('选项插入完毕');
										callback();
									}
								});

							}else{
								//问答无选项，直接回调
								callback();
							}
							//callback();
						}
					});
				},function(err) {
					// 所有SQL执行完成后回调
					if(err){
						questioncb({
							code:0,
							mag:'faild',
							data:error
						});
					}else{
						questioncb({
							code:200,
							msg:'success',
							data:surveyId
						});
					}
					//释放连接 
	            	connection.release();
				});
			});
		}	
	}
};


