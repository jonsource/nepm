module.exports = {
	// route middleware to make sure
	isLoggedIn: function(req, res, next) {
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();
		
		// if they aren't redirect them to the home page
		req.flash('info', 'Log in first!')
		res.redirect('/');
	},

	isLoggedInJson: function(req, res, next) {
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();
		
		res.json({error:'not authenticated'});
	}
}
