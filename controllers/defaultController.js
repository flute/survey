var express = require('express');
var router = express.Router();
// service
var servicegetAnalyze = require('../service/getAnalyze'),
	upload = require('../service/upload');

router.get('/survey/analyze/:id', function(req, res) {
	getAnalyze(req, res);
});
router.post('/upload', function(req, res) {
	upload(req, res);
});
router.get('/logout', function(req, res) {
	req.session.user = null;
    res.redirect('/'); //登出成功后跳转到主页
});
router.get('/', function(req, res) {
	res.redirect('/survey/list?page=1');
});

/**
 * 获取统计结果
 */
function getAnalyze(req, res){
	servicegetAnalyze(req,function(result){
		res.render('analyze',result);
	})
}

module.exports = router;