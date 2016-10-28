/**
 * Schedulers hook
 * https://www.npmjs.org/package/node-schedule
 */

module.exports = function (sails) {

/**
 * Module dependencies.
 */

var schedule = require('node-schedule');

/**
 * Expose hook definition
 */

  return {

     // Run when sails loads-- be sure and call `next()`.
     initialize: function (next) {
		Site
			.find({})
			.exec(function(err,sites){
				if (err) return throw err;
				
				angular.forEach(sites,function(site,idx){
					/*schedule job*/
					var j = schedule.scheduleJob('*/30 * * * * *', function(){
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
								// if (err) return res.negotiate(err);
								// return res.json(site);
							});
						});
					});					
					/*end schedule job*/					
				});
				return next();
			});
		// Object.keys(sails.config.crontab).forEach(function(key) {
		// var val = sails.config.crontab[key];
		// schedule.scheduleJob(key, val);
		// });
        
     }
 };
};