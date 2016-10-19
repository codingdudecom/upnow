/**
 * Site.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	url:{
  		type:'string'
  	},
  	lastCheck:{
  		type:'datetime',
  		defaultsTo:function(){
  			return new Date();
  		}
  	},
  	lastStatusCode:{
  		type:'integer'
  	},
  	lastStatusMessage:{
  		type:'string'
  	},
  	avgResponseTime:{
  		type:'integer'
  	},

  	owner:{
  		model:'userGroup'
  	}
  }  
};

