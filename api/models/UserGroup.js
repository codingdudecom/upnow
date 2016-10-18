/**
 * UserGroup.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name:{
  		type:'string'
  	},
  	users:{
  		collection:'user',
  		via:'owner'
  	},
  	sites:{
  		collection:'site',
  		via:'owner'
  	}
  },
  signup: function (inputs, cb) {
    // Create a user
    User.create({
      name: inputs.name
    })
    .exec(cb);
  }
};

