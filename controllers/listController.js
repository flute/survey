var express = require('express');
var router = express.Router();
// service
var serverGetSurveyLists = require('../service/getSurveyLists'),
	serverdelSurvey = require('../service/delSurvey'),
	serverpublishSurvey = require('../service/publishSurvey');

router.get('/', function(req, res) {
	getSurveyLists(req, res);
});
router.get('/publish/:id', function(req, res) {
	publishSurvey(req, res);
});
router.get('/del/:id', function(req, res) {
	delSurvey(req, res);
});

/**
 * 获取问卷列表
 */
function getSurveyLists(req, res){
	serverGetSurveyLists(req, function(err, result){
		if( !err ){
			res.render('list', result);
		}else{
			res.render('common/error', result);
		}
	});
}
/**
 * 删除问卷
 */
function delSurvey(req, res){
	serverdelSurvey(req, function(result){
		res.json(result);
	});
}
/**
 * 发布问卷
 */
function publishSurvey(req, res){
	serverpublishSurvey(req, function(result){
		res.json(result);
	});
}

module.exports = router;