/* jshint node: true */
'use strict';

const fbClient = require('./fb_client');
const misc = require('./misc');
const async = require('async');

function messageformat(action)
{	
	if(action == "showOfferOptionsToUser")
		{
		var messages = [{
			"type":1,
			"title":"Youtube offers list.",
			"subtitle":"Offers",
			"imageUrl":"http://www.androidpolice.com/wp-content/themes/ap2/ap_resize/ap_resize.php?src=http%3A%2F%2Fwww.androidpolice.com%2Fwp-content%2Fuploads%2F2015%2F05%2Fnexus2cee_YouTube_thumb1.png&w=150&h=150&zc=3",
			"buttons":[
              {
                "postback":"https://goo.gl/sIZCze",
                "text":"Youtube 1 day"
              },
              {
                "postback":"https://goo.gl/6eFDBP",
                "text":"Facebook 1 hr"
              }              
            ]			
			}]
		}
		
		if(action == "UserAcceptance")
		{
		var messages = [{
			"type":0,
			"speech":"Thanks for your response."
			}]			
		}

		if(action == "surprisetalk")
		{
		var messages = [{
			"type":0,
			"speech":"Welcome to bot chat."
			}]			
		}
		
return messages;
}		
