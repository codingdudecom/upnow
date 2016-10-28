/**
 * SiteController
 *
 * @description :: Server-side logic for managing sites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _update = require('sails/lib/hooks/blueprints/actions/update');
var _create = require('sails/lib/hooks/blueprints/actions/create');

var schedule = require('node-schedule');

module.exports = {
	index:function(req,res){
		var user = req.session.me;
		Site
			.find({owner:user.owner})
			.exec(function(err,sites){
				if (err) return res.negotiate(err);
				// if (req.wantsJSON) 
				// return res.json(sites);
				// return res.view('site/index');
				res.ok(sites);
			});
	},

	create: function(req,res){


		var url = req.param("url");
		var user = req.session.me;

		var startTime = new Date();

		WebsiteCheckerService.checkSite(url,
			function(data){
				var respTime = new Date().getTime() - startTime;
				Site.create({
					url: url,
					owner: user.owner,
					avgResponseTime: respTime,
					lastStatusCode: data.statusCode,
					lastStatusMessage: data.statusMessage,
					alertEmails:[user.email]
				})
				.exec(function(err, site){
					if (err) return res.negotiate(err);
					//console.log(site.checkInterval);

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
					
					SiteLog.create(
						{
							statusCode:data.statusCode,
  							statusMessage:data.statusMessage,
  							responseTime:respTime,
  							owner:site.id
  						})
					.exec(function(err,siteLog){
						if (err) return res.negotiate(err);
						return res.json(site);
					});
					
				});	
			},
			function(err){
			  return res.serverError(err);
			}
		);	
	},

	findOne: function(req,res){

		var user = req.session.me;
		Site
			.findOne({id:req.param('id'),owner:user.owner})
			.exec(function(err,sites){
				if (err) return res.negotiate(err);
				// if (req.wantsJSON) 
				// return res.json(sites);
				// return res.view('site/index');
				res.ok(sites);
			});		
	},
	update: function(req,res,next){

		var user = req.session.me;
		Site
			.findOne({id:req.param('id'),owner:user.owner})
			.exec(function(err,site){

				if (err) return res.negotiate(err);
				
				_update(req,res);
			});
	},
	destroy: function(req,res){
		var user = req.session.me;
		Site
			.destroy({id:req.param('id'),owner:user.owner})
			.exec(function(err,sites){
				if (err) return res.negotiate(err);
				// if (req.wantsJSON) 
				// return res.json(sites);
				// return res.view('site/index');
				res.ok(sites);
			});	
	}
};

