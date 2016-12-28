var mysql = require('mysql');
var conf = require('../conf/db.js');
//使用连接池，提升性能
var pool = mysql.createPool( conf.mysql );
//async
var async = require('async');
//时间转换组件
var moment = require('moment');

module.exports = {
	getResult : function(page,callback){
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
			connection.query("select * from t_survey_result limit "+startNumber+",10",function(error,result){
				if(result){
					connection.query("select id from t_survey_result",function(err,re){
						if( re ){

							var datas = [];
							async.eachSeries( result, function(item,cb){
								connection.query("select title from t_survey where id="+item.surveyId,function(err,res){
									if( res ){
										item.title = res[0].title;	
										datas.push(item);
									}
									cb(err,res);
								})
							},function(e){
								if(e){
									callback({
										code:0,
										msg:'failed',
										result:err
									});
								}else{
									callback({
										code:200,
										msg:'success',
										result:datas,
										count:re.length
									});
								}
								//释放连接 
			            		//connection.release();
							})
						}else{
							callback({
								code:0,
								msg:'failed',
								result:error
							});
						}
					})
					//console.log(result);
					
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
	getResultById:function(id,callback){
		pool.getConnection(function(err,connection){
			if( err ){
				callback(err);
				return;
			}
			connection.query("select * from t_survey_result where id="+id,function(error,result){
				if( result ){
					var datas = [];
					var resultOption = result[0].resultOptionId.split(',');
					async.eachSeries( resultOption, function(item,cb){
						connection.query("select * from t_survey_result_option where id="+item, function(rerr,rres){
							if(rres){
								datas.push( rres[0] );
							}
							cb(rerr,rres);
						})
					},function(e){
						if(e){
							callback(e);
						}else{
							callback({
								code:200,
								msg:'success',
								surveyId:result[0].surveyId,
								result:datas
							});
						}
					})
					//console.log(resultOption);
					//callback(result);
				}else if(error){
					callback(error);
				}
				connection.release();
			})
		})
	},
	delResultById:function(id,callback){
		pool.getConnection(function(err,connection){
			if( err ){
				callback(err);
				return;
			}
			connection.query("delete from t_survey_result where id="+id,function(error,result){
				if( result ){
					
					callback(result);
				}else if(error){
					callback(error);
				}
				connection.release();
			})
		})
	}
}