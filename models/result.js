var mysql = require('../service/mysql');
//async
var async = require('async');
//时间转换组件
var moment = require('moment');

module.exports = {
	getResult : function(page,id,name,time,sort,callback){
		mysql(function(err,connection){
			if(err){
				callback(err);
				return;
			}
			if( page<=0 ){
				var startNumber = 0;
			}else{
				var startNumber = (page-1)*10;
			}
			if( time ){
				var startTime = time+' 00:00:00',
					endTime = time+' 23:59:59';
			}
			if( sort ){
				if( sort == 'asc' ){
					var sortSql = " order by createdAt asc";
				}else{
					var sortSql = " order by createdAt desc"
				}
			}else{ var sortSql = ""; }

			if( name && time ){
				var sql = "select * from t_survey_result where surveyId="+id+" and userId='"+name+"' and createdAt between '"+startTime+"' and '"+endTime+"' "+sortSql+" limit "+startNumber+",10",
					countSql = "select * from t_survey_result where surveyId="+id+" and userId='"+name+"' and createdAt between '"+startTime+"' and '"+endTime+"'";
			}else if(name){
				var sql = "select * from t_survey_result where surveyId="+id+" and userId='"+name+"' "+sortSql+" limit "+startNumber+",10",
					countSql = "select * from t_survey_result where surveyId="+id+" and userId='"+name+"'";
			}else if(time){
				var sql = "select * from t_survey_result where surveyId="+id+" and createdAt between '"+startTime+"' and '"+endTime+"' "+sortSql+" limit "+startNumber+",10",
					countSql = "select * from t_survey_result where surveyId="+id+" and createdAt between '"+startTime+"' and '"+endTime+"'";
			}else{
				var sql = "select * from t_survey_result where surveyId="+id+sortSql+" limit "+startNumber+",10",
					countSql = "select * from t_survey_result where surveyId="+id;
			}
			
			connection.query(sql,function(error,result){
				if(result){
					connection.query(countSql,function(err,re){
						if( re ){
							var datas = [];
							async.eachSeries( result, function(item,cb){
								connection.query("select title from t_survey where id="+item.surveyId,function(err,res){
									if( res && res.length>0 ){
										item.title = res[0].title;	
										connection.query("select name,icon from t_user where id="+item.userId,function(er,re){
											if( re && re.length>0 ){
												item.name = re[0].name;
												item.icon = re[0].icon;
												datas.push(item);
												cb();
											}else{
												cb(er)
											}
										})
									}else{
										cb(err)
									}
									
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
		mysql(function(err,connection){
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
		mysql(function(err,connection){
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