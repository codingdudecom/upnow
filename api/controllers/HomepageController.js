/**
 * HomepageController
 *
 * @description :: Server-side logic for managing Homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var http = require('follow-redirects').http;
var https = require('follow-redirects').https;

module.exports = {
	


  /**
   * `HomepageController.checkUpNow()`
   */
  checkUpNow: function (req, res) {
  	var site = req.param("site");
  	if (validURL(site)){
  		var options = parseURL(site);
  		options.method = "HEAD";
  		options.maxRedirects = 3;
		
		var startTime = new Date().getTime();
		
  		var siteReq = http.request(
  			options, 
  			function(siteResponse){
				return res.json({
				      site: site,
				      responseTime: new Date().getTime() - startTime,
				      statusCode:siteResponse.statusCode,
				      statusMessage:siteResponse.statusMessage
				    });
  			}
  			);

  		siteReq.on('error',function(siteResponse){
  			return res.json({
  				site: site,
				responseTime: new Date().getTime() - startTime,
				statusCode:siteResponse.statusCode,
				statusMessage:siteResponse.statusCode?siteResponse.statusMessage:"DNS Not Found"
  			});
  		});
  		siteReq.end();

	    
	} else {
		return res.serverError("Invalid URL");
	}
  }
};

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)+'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

function parseURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)+'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  var match = pattern.exec(str);
  return {
  	host:match[2],
  	path:match[9]
  };
}