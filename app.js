var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
// log4js
var log4js = require("./conf/log.js");

var app = express();
    log4js.use(app);

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// static resource path
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// cookie
app.use(cookieParser());
app.use(session({
    secret: 'wenjuan',
    name:'wj',
    cookie: {
        maxAge: 1000 * 60 * 60
    },// 1h
    resave: false,
    saveUninitialized: true,
}));
// router
routes(app);

app.get('*', function(req, res){
    console.log('404页面');
    res.render('404', {
        title: 'No Found'
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(3100, function() {
    console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;