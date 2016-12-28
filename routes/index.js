var express = require('express');
var router = express.Router();
var Create = require('../models/create.js');
var List = require('../models/list.js');
var Result = require('../models/result.js');
//时间转换组件
var moment = require('moment');

module.exports = function(app) {
	//主页
    app.get('/', function(req, res) {
        res.render('index', {
            title: '主页',
        });
    });
    //登陆
    app.get('/login', checkNotLogin);
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登陆',
        });
    });
    //app.post('/login', checkNotLogin);
    app.post('/login', function(req, res) {
        var username = req.body.username,
        	pwd = req.body.pwd;
        if( username && pwd ){
        	if( username == '18001194295' && pwd == '123456' ){
        		var user = {
	        		userId : 6,
	        		userName:'盖伦'
	        	};
	        	//设置session
	        	req.session.user = user;
	        	res.json({
	        		status:1,
	        		msg:'success',
	        		data:user
	        	});
        	}else{
        		res.json({
	        		status:0,
	        		msg:'failed',
	        		data:[]
	        	})
        	}
        }else{
        	res.json({
        		status:0,
        		msg:'failed',
        		data:[]
        	})
        }
    });
    //退出登录
    app.get('/logout', function(req, res) {
        req.session.user = null;
        res.redirect('/login'); //登出成功后跳转到主页
    });
    //新建调查问卷页面
    app.get('/survey/create', checkLogin);
    app.get('/survey/create', function(req, res) {
        res.render('create', {
            title: '创建问卷',
            user:req.session.user,
            tag:'create'
        });
    });
    //新建问卷-提交问卷
    app.post('/survey/create', checkLogin);
    app.post('/survey/create',function(req,res){
    	var data = req.body.data;
    	data = JSON.parse(data);
    	
    	if( !data || data.title == '' || data.data.length <= 0  ){
    		res.json({
    			status:0,
    			msg:'问卷选项不能为空'
    		});
    	}else{
    		//插入问卷数据
    		var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    		var surveyData = {
    			createdAt:datetime,
    			updatedAt:datetime,
    			adminId:1,
    			title:data.title,
    			data:data.data
    		};
    		Create.insertSurvey(surveyData,function(result){
    			if( result.code == 200 ){    				
    				var data = result.obj;
    				var surveyId = result.data.insertId;
    				//插入问卷成功,接着使用[async.eachSeries]按顺序批量插入问题及选项
    				Create.insertQuestion({
    					surveyId:surveyId,
    					data:data
    				},function(result){
    					console.log('插入完成');
    					console.log(result);
    					res.json(result);
    				})
    			}else{
    				res.json(result);
    			}
    		});	
    	}
    });
    //问卷列表
    app.get('/survey/list/:page', checkLogin);
    app.get('/survey/list/:page',function(req,res){
    	var page = req.params.page;
    	List.getAllSurvey(page,function(result){
    		if( result.code == 200 ){
    			for( var i=0;i<result.result.length;i++ ){
    				var createdAt = moment( result.result[i].createdAt ).format('YYYY-MM-DD HH:mm:ss');
    				var updatedAt = moment( result.result[i].updatedAt ).format('YYYY-MM-DD HH:mm:ss');
    				result.result[i].createdAt = createdAt;
    				result.result[i].updatedAt = updatedAt;
    			}
    			console.log(result);
    			var data = {
    					title:'查看问卷',
    					user:req.session.user,
	    				status:1,
	    				tag:'list',
	    				msg:'success',
	    				currentPage:page,
	    				totalPages:Math.ceil( result.count/10 ),
	    				data:result.result
	    			};
    		}else{
    			var data = {
    					title:'查看问卷',
    					user:req.session.user,
	    				status:0,
	    				tag:'list',
	    				msg:'failed',
	    				data:result.result
	    			};
    		}
    		//res.json(data);
    		res.render('list', data);
    	})
    });
 	app.get('/survey/list/del/:id', checkLogin);
    app.get('/survey/list/del/:id',function(req,res){
    	var id = req.params.id;
    	List.delSurveyById(id,function(result){
    		if( result.fieldCount == 0 ){
    			res.json({
    				status:1,
    				msg:'success',
    				data:id
    			});
    		}else{
    			res.json({
    				status:0,
    				msg:'failed',
    				data:id
    			});
    		}
    	});
    });
    //问卷详情
    app.get('/survey/p/:id',function(req,res){
    	var id = req.params.id;
    	List.getSurveyById(id,function(result){
    		
    		if(result){
    			var question = result.question;
    			result.question = [];
    			for( var i in question ){
    				result.question.push( question[i] );
    			}
    			//res.json(result);
    			res.render('page',result);
    		}
    	})
    });
    //提交问卷
    //app.post('/survey/p/:id', checkLogin);
    app.post('/survey/p/:id',function(req,res){
    	//console.log(res);
    	var surveyId = req.params.id;
    	var data = req.body.data;
    	data = JSON.parse(data);
    	//console.log(data);
    	var datas = {
    		surveyId:surveyId,
    		data:data
    	};
    	List.saveAnswer(datas,function(result){
    		console.log(result);
    		if( result.code == 200 ){
    			res.json({
    				status:1,
    				msg:'success',
    				data:result.data
    			})
    		}else{
    			res.json({
    				status:0,
    				msg:'failed',
    				data:result.data
    			})
    		}
    	})
    });
    //问卷结果列表
    app.get('/survey/result/:page', checkLogin);
    app.get('/survey/result/:page',function(req,res){
    	var page = req.params.page;
    	Result.getResult(page,function(result){
    		if( result.code == 200 ){
    			for( var i=0;i<result.result.length;i++ ){
    				var createdAt = moment( result.result[i].createdAt ).format('YYYY-MM-DD HH:mm:ss');
    				var updatedAt = moment( result.result[i].updatedAt ).format('YYYY-MM-DD HH:mm:ss');
    				result.result[i].createdAt = createdAt;
    				result.result[i].updatedAt = updatedAt;
    			}
    			var data = {
    					title:'问卷结果',
    					user:req.session.user,
	    				status:1,
	    				tag:'result',
	    				msg:'success',
	    				currentPage:page,
	    				totalPages:Math.ceil( result.count/10 ),
	    				data:result.result
	    			};
    		}else{
    			var data = {
    					title:'问卷结果',
    					user:req.session.user,
	    				status:0,
	    				tag:'result',
	    				msg:'failed',
	    				data:result.result
	    			};
    		}
    		//res.json(data);
    		res.render('result', data);
    	})
    });
    app.get('/survey/result/del/:id',function(req,res){
    	var id = req.params.id;
    	Result.delResultById(id,function(result){
    		if( result.fieldCount == 0 ){
    			res.json({
    				status:1,
    				msg:'success',
    				data:id
    			});
    		}else{
    			res.json({
    				status:0,
    				msg:'failed',
    				data:id
    			});
    		}
    	})
    });
    //问卷结果
    app.post('/survey/result/p/:id', checkLogin);
    app.post('/survey/result/p/:id',function(req,res){
    	var id = req.params.id;
    	//取该答卷结果
    	Result.getResultById(id,function(result){
    		console.log(result);
    		if( result.code == 200 ){
    			var surveyId = result.surveyId;
    			//取问卷
    			List.getSurveyById(surveyId,function(survey){
		    		if(survey){
		    			var question = survey.question;
		    			survey.question = [];
		    			for( var i in question ){
		    				survey.question.push( question[i] );
		    			}
		    			/*var data = {
		    				title:survey.title,
		    				survey:survey,
		    				result:result
		    			}
		    			res.render('result-page',data)*/
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
		    			//console.log( JSON.stringify(survey) );
		    			res.json({
		    				status:1,
		    				msg:'success',
		    				result:survey
		    			});
		    		}
		    	})
    		}
    	})
    });
    //检查是否登陆
    function checkLogin(req, res, next) {
    	console.log(req.session.user);
        if (!req.session.user) {
        	console.log('未登录');
            res.redirect('/login');
        }
        next();
    }
    //检查是否未登录
    function checkNotLogin(req, res, next) {
    	console.log(req.session.originalMaxAge);
        if (req.session.user) {
        	console.log('已登录');
            res.redirect('back');
            //res.redirect('survey/create');
        }
        next();
    }
};
