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
     	sails.on('hook:orm:loaded', function() {

			Site
				.find({})
				.exec(function(err,sites){
					if (err) throw new Exception(err);
					
					sites.forEach(function(site,idx){
						/*schedule job*/
						var j = schedule.scheduleJob('siteSchedule'+site.id,'*/30 * * * * *', function(){
							Site.performCheck(site);
						});
						/*end schedule job*/					
					});
					return next();
				});
		});
     }
 };
};