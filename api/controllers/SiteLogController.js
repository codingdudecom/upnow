/**
 * SiteLogController
 *
 * @description :: Server-side logic for managing Sitelogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index:function(req,res){
		var user = req.session.me;
		var timeWindow = req.param("timeWindow")?parseInt(req.param("timeWindow")):(24*3600*1000);
		SiteLog
			.find(
				{
					where:{
						createdAt:{
							'>=':new Date((new Date()).getTime() - timeWindow)
						}
					}
				}
			)
			.sort('id')
			.populate('owner')
			.exec(function(err,siteLogs){
				if (err) return res.negotiate(err);
				var filteredSiteLogs = [];
				siteLogs.forEach(function(el,idx){
					if (el.owner.owner == user.owner){
						filteredSiteLogs.push(el);	
					}					
				});
				return res.ok(filteredSiteLogs);
			});
	}
};

