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


        /*send activation email*/
        EmailService.sendEmail(
          {
            to:user.email,
            message:'Hi,<br/><br/>Thank you for registering UpNOW, real time monitoring for your websites.<br/><br/>In order to start website monitoring please activate your account by clicking <a href="'
            +ConfigService.getServerURL(req)+'/user/activateAccount?c='+user.activationCode
            +'">this link</a>.',
            subject:'UpNOW account activation'
          },
          function(success){
            console.log(success);
          },
          function(err){
            console.log(err);
          }
        );
        /*end send activation email*/

        // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
        // send a 200 response letting the user agent know the signup was successful.
        if (req.wantsJSON) {
          res.header('Location','/login');
          req.flash('message','Registration successful! Please check your email account for the activation link');
          req.flash('message-type','success');
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

  },
  activateAccount:function(req,res){

    User.activateAccount({
      activationCode:req.param("c")
    },function(err,user){
      if (err) return res.negotiate(err);

      // req.flash('message','account activated');
      // req.flash('message-type','success');
      // req.flash('email',user[0].email);
      // return res.redirect('/login');

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user[0];
      req.session.authenticated = true;

      return res.redirect('/app/');
    });
  },
  me:function(req,res){
    if (req.session.me){
      if (req.method == "GET"){
        //return current user
        return res.ok(req.session.me);
      } else if (req.method == "POST"){
        User
          .findOne(req.session.me.id)
          .exec(function(err,user){
              if (err) req.negotiate(err);

              var userData = {
                name:req.body.name,
                email:req.body.email
              };

              console.log(req.body);

              if (req.body.password){
                userData.password = req.body.password
              };

              

              User
                .update(
                  {id:req.session.me.id},
                  userData
                )
                .exec(function(err,user){
                  if (err) return res.negotiate(err);
                  req.session.me = user[0];
                  return res.ok(user[0]);
                });
              
          });
      }
    } else {
      return res.forbidden("Not logged in");
    }
  }
};

