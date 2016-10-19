/**
 * SiteController
 *
 * @description :: Server-side logic for managing sites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
				Site.create({
					url: url,
					owner: user.owner,
					avgResponseTime: new Date().getTime() - startTime,
					lastStatusCode: data.statusCode,
					lastStatusMessage: data.statusMessage
				})
				.exec(function(err, site){
				if (err) return res.negotiate(err);
					return res.json(site);
				});						
			  	
			},
			function(err){
			  return res.serverError(err);
			}
		);	
		
	    
	}
};

