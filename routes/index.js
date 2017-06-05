var express = require('express');
var ssoLogin = require("../service/ssoLogin");
// controllers
var listController = require('../controllers/listController'),
    pageController = require('../controllers/pageController'),
    resultController = require('../controllers/resultController'),
    createController = require('../controllers/createController'),
    defaultController = require('../controllers/defaultController');

module.exports = function(app) {

    app.use(ssoLogin.checkLogin);

    app.use('/survey/list', listController);

    app.use('/survey/p/', pageController);

    app.use('/survey/result/', resultController);

    app.use('/survey/create', createController);
 
    app.use('/',defaultController);
    
};
