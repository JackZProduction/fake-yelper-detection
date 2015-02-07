// set up all the tools we need
var port            = Number(process.env.PORT || 3000);
var http            = require ('http');
var path            = require ('path');
var connect         = require ('connect');
var express         = require ('express');
var bodyParser      = require ('body-parser');
var app             = express ();
var session         = require ('express-session');
var cookieParser    = require ('cookie-parser');
var sessionStore    = new session.MemoryStore ();
var server          = http.createServer (app);
var mongoose        = require ('mongoose');
var Schema          = mongoose.Schema;
var _               = require ('underscore');
var SessionSockets  = require ('session.socket.io')
server.listen (port);

/* global variables */
global.io             = require ('socket.io').listen(server);
global.sessionSockets = new SessionSockets (io, sessionStore, cookieParser);

app.use (bodyParser.urlencoded({ extended: true }));
app.use (bodyParser.json());  // get information from html forms
app.use (cookieParser());     // read cookies (needed for auth)
app.use (session({            // session secret
  store: sessionStore,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// use EJS templating engine
app.engine('.html', require('ejs').__express); // Using the .html instead of .ejs
app.set('views', __dirname + '/views'); // Set the folder where the pages are kept
app.set('view engine', 'html'); // This avoids having to provide the extension to res.render()
app.use (express.static ('./public')); // statically fetching public files
app.disable('x-powered-by'); // remove x-powered-by: express header


// database


// routes
require('./server/rest.js')(app);


console.log("Server started on localhost:" + port);