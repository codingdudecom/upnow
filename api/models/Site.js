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
    alertEmails:{
      type:'array'
    },
    checkInterval:{
      type:'integer',
      defaultsTo:15
    },

  	owner:{
  		model:'userGroup'
  	}
  },
  performCheck:function(site,next){
    var startTime = new Date().getTime();
    WebsiteCheckerService.checkSite(site.url,function(data){
      var delta = new Date().getTime() - startTime;
      SiteLog.create(
      {
          statusCode:data.statusCode,
          statusMessage:data.statusMessage,
          responseTime:delta,
          owner:site.id
      })
      .exec(function(err,siteLog){
        SiteLog
          .find({owner:siteLog.owner})
          .average("responseTime")
          .exec(function(err,avg){
            if (err) throw JSON.stringify(err);

            console.log(site.url +" : "+avg[0].responseTime);

            site.avgResponseTime = parseInt(avg[0].responseTime);
            Site
              .update(siteLog.owner,site)
              .exec(function(err,sites){
                if (err) throw JSON.stringify(err);

                next && next();
              });
          });
      });
    });  
  }
};

