var extend = require('xtend');
var authentication = require('./authentication');
var log = require('debug')('nepm:rest_router');
var cors = require('cors');
var jwt = require('jsonwebtoken');

// app/routes.js
module.exports = function(app, passport) {
	// make flash messages always available in render
	app.use(function(req, res, next) {
		var old_render = res.render;
		res.render = function(view, options, fn) {
			var messages = {};
			var keys = ['info','error','warning','success'];
			for(var i in keys) {
				messages[keys[i]] = req.flash(keys[i]);
			}
			if(!options) {
				options = {};
			}
			options = extend(options, {messages: messages});
			old_render.call( this, view, options, fn );
		}
		next();
	});
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', function(req,res,next) {
		log("authenticate endpoint %O", req.body);
		passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		})(req,res,next)
		},
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	app.options('/authenticate', cors());
    app.post('/authenticate', cors(), function(req, res, next) {
        log("authenticate endpoint ", req.body);
        passport.authenticate('local-login', function(err, user, info) {
            log(err, user, info);
            if (err) { return next(err) }
            if (!user) { 
            	log("authentication failed", req.data);
            	return res.json({error: "authentication failed"}) 
            }
            log("authenticated user", user.username);
            return res.json(
            {
            	username: user.username,
            	id: user.id,
            	token: jwt.sign(user.id, passport.superSecret)
            })
        })(req, res, next);
    });

    // =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', authentication.isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/upload', function(req, res) {
		res.render('upload.ejs');
	});

	app.options('/v1', cors(), function(req, res) {
		log("zlo");
	});
	app.use('/v1', require('./apiv1')(app.models));

}
