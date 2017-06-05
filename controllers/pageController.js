var express = require('express');
var router = express.Router();
// service
var servershowSurvey = require('../service/showSurvey'),
	serversubmitSurveyResult = require('../service/submitSurveyResult');

router.post('/:id', function(req, res) {
	submitSurveyResult(req, res);
});
router.get('/:id/:terminal', function(req, res) {
	showSurvey(req, res);
});

/**
 * 显示答卷
 */
function showSurvey(req, res){
	servershowSurvey(req, function(err, result){
		if( !err ){
			res.render('page', result);

		}else{
			res.render('common/error', result);
		}
	});
}
/**
 * 提交答卷结果
 */
function submitSurveyResult(req, res){
	serversubmitSurveyResult(req, function(result){
		res.json(result);
	});
}

module.exports = router;