/**
 * SiteLogController
 *
 * @description :: Server-side logic for managing Sitelogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index:function(req,res){
		var user = req.session.me;
		SiteLog
			.find()
			.populate('owner',{})
			.exec(function(err,siteLogs){
				if (err) return res.negotiate(err);
				var filteredSiteLogs = [];
				siteLogs.forEach(function(el,idx){
					if (el.owner.owner == user.owner){
						filteredSiteLogs.push(el);	
					}					
				});
				res.ok(filteredSiteLogs);
			});
	}
};

