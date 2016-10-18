/**
 * AppController
 *
 * @description :: Server-side logic for managing Apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `AppController.index()`
   */
	index:function(req,res){
		var user = req.session.me;
		Site
			.find({owner:user.owner})
			.exec(function(err,sites){
				if (err) return res.negotiate(err);
				return res.view('app');
			});
	},
};

