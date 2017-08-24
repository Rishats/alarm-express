var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SerialPort = require('serialport');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(8000, function () {
    console.log('App listening on port 8000!')
})

// COM data

var port = new SerialPort('/dev/ttyACM1', {
    baudRate: 115200
});

port.on('readable', function () {

    //console.log(port.read().toString().match(/\d{2}/));
    var rezultat = port.read().toString().match(/(^\d{1,2})\D+(\d{1,4})/);
    console.log(rezultat);

});



// Open errors will be emitted as an error event
port.on('error', function(err) {
    console.log('Error: ', err.message);
})


