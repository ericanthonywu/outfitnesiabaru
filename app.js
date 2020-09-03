const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet')
const bodyParser = require('body-parser')

// password mysql server: pmi;aqp-+0#S

const app = express();
app.use(helmet())
app.use(cors());
// {
    // origin: "http://194.59.165.96/",
    // optionsSuccessStatus: 200,
// }
require('dotenv').config({path: ".env"})

const indexRouter = require('./routes/index'); // for global router
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const tokoRouter = require('./routes/toko');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/toko', tokoRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
