var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { Client } = require("whatsapp-web.js");
const client = new Client();
const qrcode = require("qrcode-terminal");
const csv = require("csv-parser");
const fs = require("fs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let contacts = [];

fs.createReadStream("contact.csv")
  .pipe(csv())
  .on("data", (data) => contacts.push(data))
  .on("end", () => {
    console.log(contacts);
  });

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  contacts.forEach((e) => {
    let number;
    if (e.NUMBER[0] === "+") {
      number = e.NUMBER.substring(1) + "@c.us";
    } else if (e.NUMBER[0] === "0") {
      //change 62 if you want to use another country code
      number = "62" + e.NUMBER.substring(1) + "@c.us";
    } else {
      number = e.NUMBER;
    }
    //change message here
    const msg = `Eid mubarak ${e.NAME}!🙏🏻😇`;
    client.sendMessage(number, msg).then((res) => {
      console.log("Message sent to " + e.NAME);
    });
  });
});

client.initialize();

module.exports = app;
