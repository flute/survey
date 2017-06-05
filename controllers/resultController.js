var express = require('express');
var router = express.Router();
// service
var servicedelResult = require('../service/delResult'),
	serviceresultInfo = require('../service/resultInfo'),
	serviceresultLists = require('../service/resultLists');

router.get('/:id', function(req, res) {
	resultLists(req, res);
});
router.post('/p/:id', function(req, res) {
	resultInfo(req, res);
});
router.get('/del/:id', function(req, res) {
	delResult(req, res);
});
/**
 * 删除答卷
 */
function delResult(req, res){
	servicedelResult(req, function(result){
		res.json(result);
	});
}
/**
 * 答卷详情
 */
function resultInfo(req, res){
	serviceresultInfo(req, function(result){
		res.json(result);
	});
}
/**
 * 答卷列表
 */
function resultLists(req, res){
	serviceresultLists(req, function(result){
		res.render('result', result);
	});
}

module.exports = router;

