var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var serveIndex = require('serve-index');
var routes = require('./routes/index');
var users = require('./routes/users');
var templates = require('./routes/templates');
var session = require('./routes/session');
var media = require('./routes/media');
var projects = require('./routes/projects');
var fileupload = require('./routes/fileupload');



// Multer settings: upload file.

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("storage is set to uploads/ folder");
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
});

//var upload = multer({ dest: 'uploads/' });
var upload = multer({ storage: storage });

// Allow cors
var allowCrossDomain = function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    next();
};


var app = express();
app.use(express.static(__dirname + "/"));
app.use('/artifacts', serveIndex(path.join(__dirname, 'uploads')));
app.use('/artifacts', express.static(path.join(__dirname, 'uploads')));
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

 // setup db connection string
 var connection_string = 'mongodb://administrator:ca$hc0w@127.0.0.1:27017/cerebro';
 var mongoose = require('mongoose');
 var connection = mongoose.createConnection(connection_string);
 connection.on('error', console.error.bind(console, 'connection error:'));
 connection.once('open', function () {
 console.log('Connected to database cerebro')
 });

 // setup db context
 var userModel = require('./models/user');
 var projectModel = require('./models/project');
 var templateModel = require('./models/template');
 var mediaModel = require('./models/media');
var sessionModel = require('./models/session');

 function db (req, res, next) {
     console.log('inside db function');
     req.db = {
         User: connection.model('User', userModel.User, 'users'),
         Template: connection.model('Template', templateModel.Template, 'templates'),
         Project: connection.model('Project', projectModel.Project, 'projects'),
         Media: connection.model('Media', mediaModel.Media, 'medias'),
         Session: connection.model('Session', sessionModel.Session, 'sessions')
     };
     console.log('inside db function exit..');
     return next();
 }

// Define routes
app.use('/', db, routes);

// Users
app.use('/users', db, users);
app.post('/users', db, users.post);
app.get('/users/:id', db, users.get);
app.put('/users/:id', db, users.put);
app.delete('/users/:id', db, users.delete);

// Templates
app.use('/templates', db, templates);
app.post('/templates',  db, templates.post);
app.get('/templates/:id', db, templates.get);
app.put('/templates/:id', db, templates.put);
app.delete('/templates/:id', db, templates.delete);

// Media
app.use('/media', db, media);
app.post('/media',  db, media.post);
app.get('/media/:id', db, media.get);
app.put('/media/:id', db, media.put);
app.delete('/media/:id', db, media.delete);

// Project
app.use('/projects', db, projects);
app.get('/projects', db, projects.get);
app.post('/projects',  db, projects.post);
app.get('/projects/:id', db, projects.get);
app.put('/projects/:id', db, projects.put);
app.delete('/projects/:id', db, projects.delete);

// Session
app.use('/session', db, session);
app.get('/session', db, session.get);
app.post('/session', db, session.post);
app.delete('/session/:id', db, session.delete);

// File
app.use('/fileupload', upload.single('avatar'), fileupload);
app.post('/fileupload', upload.single('avatar'),fileupload.post);
app.get('/fileupload/:id', db, fileupload.get);

// route middleware to validate :name
app.param('id', function(req, res, next, id) {
    console.log('doing name validations on ' + id);
    req.id = id;
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //console.log(err.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
