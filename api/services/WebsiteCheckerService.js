var http = require('follow-redirects').http;
var https = require('follow-redirects').https;

module.exports = {
	checkSite:function(site,done,err){
    if (this.validURL(site)){
      		var options = this.parseURL(site);
      		options.method = "HEAD";
      		options.maxRedirects = 3;
    		
    		var startTime = new Date().getTime();
    		
      		var siteReq = http.request(
      			options, 
      			function(siteResponse){
      				done({
      				      site: site,
      				      responseTime: new Date().getTime() - startTime,
      				      statusCode:siteResponse.statusCode,
      				      statusMessage:siteResponse.statusMessage
      				    });
        			}
      			);

      		siteReq.on('error',function(siteResponse){
      			done({
      				site: site,
      				responseTime: new Date().getTime() - startTime,
      				statusCode:siteResponse.statusCode,
      				statusMessage:siteResponse.statusCode?siteResponse.statusMessage:"DNS Not Found"
      			});
      		});
      		siteReq.end();    	    
    	} else {
    		err("Invalid URL");
    	}	
	},
  validURL:function(str) {
    var pattern = new RegExp('^(https?:\\/\\/)+'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  },

  parseURL:function(str) {
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
}