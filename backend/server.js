var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

var db = require('./db/setup');
db.setUpDB();
var formsRouter = require('./routes/forms');

var pathToFrontBuild = '../frontend';

var server = express();
server.use(cors());

server.use(express.static(pathToFrontBuild));
server.use(express.static(path.join(pathToFrontBuild, 'build')));

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use('/api/forms', formsRouter);

server.get('/*', function (req, res) {
    res.sendFile(path.resolve(pathToFrontBuild, 'build', 'index.html'));
});

// catch 404 and forward to error handler
server.use(function (req, res, next) {
    next(createError(404));
});

// error handler
server.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = server;
