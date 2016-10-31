/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name:{
  		type:'string'
  	},
  	email:{
  		type:'email',
      unique:true
  	},
  	password:{
  		type:'string'
  	},
    active:{
      type:'boolean',
      defaultsTo:false
    },
    activationCode:{
      type:'string',
      defaultsTo:function(){
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();        
      }
    },
  	owner:{
  		model:'userGroup'
  	}

  }, 
  signup: function (inputs, cb) {
    // Create a user
    User.create({
      name: inputs.name,
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password,
      owner: inputs.owner
    })
    .exec(cb);
  },  
  attemptLogin: function (inputs, cb) {

    User.findOne({
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password,
      active:true
    })
    .exec(cb);
  },
  activateAccount: function(inputs,cb){
    
    User.findOne({
      activationCode:inputs.activationCode
    })
    .exec(function(err,user){
      if (err) return cb(err);

      if (!user) return cb("Account not found or already activated");

      user.activationCode = null;
      user.active = true;
      User
        .update(user.id,user)
        .exec(cb);
    });
  }
};

