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
			"title":"Top Pick Offers today.",
			"subtitle":"Vamos",
 			"imageUrl":"http://images.hardwarezone.com/upload/files/2013/11/6891939f6d.jpg",
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

// Export module functions
module.exports = {
    messageformat: messageformat,
};	
