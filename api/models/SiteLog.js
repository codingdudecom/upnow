/**
 * SiteLog.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	statusCode:{
  		type:'integer'
  	},
  	statusMessage:{
  		type:'string'
  	},
  	responseTime:{
  		type:'integer'
  	},
    checkInterval:{
      type:'integer',
      defaultsTo:15
    },    
  	owner:{
  		model:'Site'
  	}  	
  }
};

