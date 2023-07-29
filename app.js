const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const waRoutes = require('./routes/whatsapp');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/wa', waRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


module.exports = app;
