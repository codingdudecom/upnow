/**
 * HomepageController
 *
 * @description :: Server-side logic for managing Homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `HomepageController.checkUpNow()`
   */
  checkUpNow: function (req, res) {
    	var site = req.param("site");
      WebsiteCheckerService.checkSite(site,
        function(data){
          return res.json(data);
        },
        function(err){
          return res.serverError(err);
        }
      );
  }
};

