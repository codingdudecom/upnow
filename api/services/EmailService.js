if (!process.env.AMAZON_SES_KEY){
	throw "UpNOW uses AmazonSES to send out emails. In order for this to work please set the following environment variables:\n\n"+
			"AMAZON_SES_KEY,AMAZON_SES_SECRET and AMAZON_SES_REGION";
}
var ses = require('node-ses'),
    client = 
    	ses.createClient(
    		{ 
    			key: process.env.AMAZON_SES_KEY, 
    			secret: process.env.AMAZON_SES_SECRET,
    			amazon: process.env.AMAZON_SES_REGION
    		}
    	);

var MailComposer = require("mailcomposer").MailComposer;

module.exports = {
	sendEmail:function(data, done, err){
        // done("Test mode email: "+data.message);
        // return;
		data.from = data.from || "UpNOW <upnow@coding-dude.com>";
		var mail = new MailComposer(
            {
                    from:data.from,
                    to:data.to,
                    bcc:data.bcc,
                    subject:data.subject,
                    html:data.message,
                    // attachments:attachments,
                    headers:{
                            "X-Report-Abuse": "Please forward a copy of this message, including all headers, to "+data.from
                    }
            });		
		mail.compile()
            .build(function(e, message){
            	if (e) err(e);
				client.sendRawEmail({
		            from:data.from,
		            to:data.to,
		            bcc:data.bcc,
		            rawMessage:message.toString()
		        },function(e,message){
		           if (e) err(e);

		           done(message);
		        });
			});
	}
}