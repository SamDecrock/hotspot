#!/usr/bin/env node

process.on("warning", e => console.warn(e.stack));

var express = require("express");
var socketio = require("socket.io");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var fs = require('fs');
var https = require('https');
var randomize = require('randomatic');
var radiusserver = require('./radiusserver');


function generateCode() {
	return randomize('?', 5, {chars: '23456789abcdefghjkmnpqrstuvwxyz'});
}

var codeOfTheDay = generateCode();
console.log('codeOfTheDay:', codeOfTheDay);

radiusserver.start(codeOfTheDay, 'radius_secret');

var cron = require('node-cron');

cron.schedule('0 0 * * *', function(){
	var codeOfTheDay = generateCode();
	console.log('midnight! changing code of the day to', codeOfTheDay);
	radiusserver.changePassword(codeOfTheDay);
});


var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(favicon(__dirname + '/public/favicon.ico')); // uncomment after placing your favicon in /public
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(require("stylus").middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
	console.log(req.query);

	res.render("index", {
		title: "KEKTechniek Hotspot",
		action: "https://" + req.query.uamip + ":" + req.query.uamhttps + "/login",
		userurl: req.query.userurl
	});
});

app.get("/admin", function(req, res) {

	res.render("admin", {
		title: "KEKTechniek Hotspot",
		codeOfTheDay: codeOfTheDay.toUpperCase()
	});
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handler:
app.use(function(err, req, res, next) {
	if (!err.status) err.status = 500;

	res.status(err.status);

	if (err.status == 404) return res.send(err.toString()); // 404 errors are not worth logging.

	if (app.get("env") === "production") {
		console.log(err.stack); // log to console
		return res.send("An error occured: " + err.status); // don't log to user
	} else {
		next(err); // log to console and user
	}
});

// const httpsOptions = {
// 	key: fs.readFileSync('./encryption/key.pem'),
// 	cert: fs.readFileSync('./encryption/cert.pem')
// };

// const webserver = https.createServer(httpsOptions, app).listen(app.get("port"), () => {
// 	console.log('Express server listening on port ' + webserver.address().port)
// });

const webserver = app.listen(app.get("port"), () => {
	console.log('Express server listening on port ' + webserver.address().port)
});
