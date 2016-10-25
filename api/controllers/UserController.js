/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: {
    rest: false
  },  
  login: function (req, res) {

    // See `api/responses/login.js`
    return res.login({
      email: req.param('email'),
      password: req.param('password'),
      successRedirect: '/app/',
      invalidRedirect: '/login'
    });
  },
  logout: function (req, res) {

    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.me`.
    req.session.me = null;
    req.session.authenticated = false;
    
    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect('/');
  },
  signup: function (req, res) {

    var signupUser = function(userGroupId){


      // Attempt to signup a user using the provided parameters
      User.signup({
        name: req.param('name'),
        email: req.param('email'),
        password: req.param('password'),
        owner:userGroupId
      }, function (err, user) {
        // res.negotiate() will determine if this is a validation error
        // or some kind of unexpected server error, then call `res.badRequest()`
        // or `res.serverError()` accordingly.
        if (err) return res.negotiate(err);

        // Go ahead and log this user in as well.
        // We do this by "remembering" the user in the session.
        // Subsequent requests from this user agent will have `req.session.me` set.
        req.session.me = user;

        // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
        // send a 200 response letting the user agent know the signup was successful.
        if (req.wantsJSON) {
          res.header('Location','/login');
          return res.ok('Signup successful!');
        }

        // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
        return res.redirect('/login');
      });
    }

    UserGroup.create(
      {
        name: req.param('name')
      },
      function(err, userGroup){
        if (err) return res.negotiate(err);

        return signupUser(userGroup.id);
      }
    );

  }    	
};

