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
				if (req.wantsJSON) return res.json(sites);
				return res.view('site/index');
			});
		
		
	},

	create: function(req,res){
		var url = req.param("url");
		var user = req.session.me;
		
	    Site.create({
	      url: url,
	      owner:user.owner
	    })
	    .exec(function(err, site){
			if (err) return res.negotiate(err);
			return res.json(site);
	    });		
	},

	findOne:function(req,res){
		return res.view({});
	}
};

