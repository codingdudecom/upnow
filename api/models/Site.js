/**
 * Site.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	url:{
  		type:'string'
  	},
  	lastCheck:{
  		type:'datetime',
  		defaultsTo:function(){
  			return new Date();
  		}
  	},
  	lastStatusCode:{
  		type:'integer'
  	},
  	lastStatusMessage:{
  		type:'string'
  	},
  	avgResponseTime:{
  		type:'integer'
  	},
    alertEmails:{
      type:'array'
    },
    checkInterval:{
      type:'integer',
      defaultsTo:15
    },
    alertSent:{
      type:'boolean',
      defaultsTo:function(){return false;}
    },

  	owner:{
  		model:'userGroup'
  	}
  },
  performCheck:function(site,next){
    var startTime = new Date().getTime();
    WebsiteCheckerService.checkSite(site.url,function(data){
      var delta = new Date().getTime() - startTime;

      /*send email alerts*/
      // site.alertEmails.forEach(function(email,idx){
      if (data.statusCode != 200 && !site.alertSent){
        //site is down and no alert was sent
        EmailService.sendEmail(
          {
            to:['upnow@coding-dude.com'],
            bcc:site.alertEmails,
            message:'Website '+site.url+' has gone offline',
            subject:'Alert: ' + site.url + ' is NOT UpNow'
          },
          function(success){
            console.log(success);
            site.alertSent = true;
          },
          function(err){
            console.log(err);
          }
        );
      } else if (data.statusCode == 200 && site.alertSent){
        //site was down and it's back up again
        EmailService.sendEmail(
          {
            to:['upnow@coding-dude.com'],
            bcc:site.alertEmails,
            message: 'Website '+site.url+' is online again',
            subject: site.url + ' is back UpNow'
          },
          function(success){
            console.log(success);
            site.alertSent = false;
          },
          function(err){
            console.log(err);
          }
        );
      }
      // });
      /*end send email alerts*/      


      SiteLog.create(
      {
          statusCode:data.statusCode,
          statusMessage:data.statusMessage,
          responseTime:delta,
          owner:site.id
      })
      .exec(function(err,siteLog){
        SiteLog
          .find({owner:siteLog.owner})
          .average("responseTime")
          .exec(function(err,avg){
            if (err) throw JSON.stringify(err);

            // console.log(site.url +" : "+avg[0].responseTime);

            site.avgResponseTime = parseInt(avg[0].responseTime);
            site.lastStatusMessage = data.statusMessage;
            site.lastStatusCode = data.statusCode;
            Site
              .update(siteLog.owner,site)
              .exec(function(err,sites){
                if (err) throw JSON.stringify(err);

                next && next();
              });
          });
      });
    });  
  }
};

