// Includs
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SerialPort = require('serialport');
var CONFIG = require('./config.json');
var mysql = require('mysql');
var moment = require('moment');

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

app.listen(8004, function () {
    console.log('App listening on port 8000!')
})

// MySQL connect

var mysql_conntection = mysql.createConnection({
  host: CONFIG['dbHost'],
  user: CONFIG['dbUser'],
  database: CONFIG['dbName'],
  password: CONFIG['dbPassword']
});

// Open connection MySQL
mysql_conntection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
})

// Save data into MYSQL

function saveM4qData(data) // Function save MQ4 data in to mysql.
{
    var sql = "INSERT INTO co (co,created_at, updated_at) VALUES ?";
    var values = [
        [data, moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
    ];
    mysql_conntection.query(sql, [values], function (err) {
        if (err) throw err;
    });
};

function save36qzData(data) // Function save 36qz data in to mysql.
{
    var sql = "INSERT INTO temperature (temperature, created_at, updated_at) VALUES ?";
    var values = [
        [data, moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
    ];
    mysql_conntection.query(sql, [values], function (err) {
        if (err) throw err;
    });
};

// COM data.

// Temperature

var port_36gz = new SerialPort(CONFIG['36gzPort'], {
    baudRate: 115200
});

port_36gz.on('readable', function () {

    var rezultat = port_36gz.read().toString()
    console.log(rezultat);
    rezultat = parseInt(rezultat);
    if(typeof(rezultat) != "undefined" && !isNaN(rezultat)){
      save36qzData(parseInt(rezultat));
      console.log('good-36qz')
    }
    else{
      console.log('bad int 36QZ');
    }

});


// Open errors will be emitted as an error event
port_36gz.on('error', function(err) {
    console.log('Error: ', err.message);
})

// CO

var port_mq4 = new SerialPort(CONFIG['mq4Port'], {
    baudRate: 115200
});

port_mq4.on('readable', function () {

    var rezultat = port_mq4.read().toString()
    console.log(rezultat);
    rezultat = parseInt(rezultat);
    if(typeof(rezultat) != "undefined" && !isNaN(rezultat)){
      saveM4qData(parseInt(rezultat));
      console.log('good-mq4')
    }
    else{
      console.log('bad int MQ4');
    }

});

// Open errors will be emitted as an error event
port_mq4.on('error', function(err) {
    console.log('Error: ', err.message);
})