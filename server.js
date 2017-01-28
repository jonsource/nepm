// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 3000;
var passport = require('passport');
var flash    = require('connect-flash');
var product = require('./models/product');
var variant = require('./models/variant');
app.db_pool = require('./app/db_pool');
app.models = {
	product: new product(),
	variant: new variant()
}
console.log('app models', app.models);
// configuration ===============================================================
// connect to our database
require('./config/passport')(passport, app.db_pool); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

var promise = require('bluebird');

app.models.product.findBy('id', 1)
.then(function(pro) {
	pro = pro[0];
	console.log('pro', pro);
	/*pro.get("name").then(function(res) {console.log(res)});
	pro.get("tags").then(res => {console.log(res)});*/
	pro.get("variants").then(function(res) {
		console.log('variants',res);
		promise.mapSeries(res, function(val) {
			return val.get("options").then(function() {return val;});
		})
		.then(function(res) {
			console.log(res);
			console.log(res[0].data);
		});
	});

});
