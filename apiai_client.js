/* jshint node: true */
'use strict';

const fbClient = require('./fb_client');
const misc = require('./misc');
const async = require('async');
const open = require('open');
const opener = require("opener");

/**
 * Handles API.AI Responses
 *
 * @param sender The ID of the user messaging with Maia.
 * @param response Response from API.AI.
 * @param callback Callback function.
 */

function handleMessages(messages, sender, callback)
{
if(messages)
{
//opener('https://goo.gl/QKNWyF', function (err) {
//  if (err) throw err;
//  console.log('The user closed the browser');
//});
console.log("Sender:"+sender);
	
console.log("Message2:"+JSON.stringify(messages));
// Adding delay between responses
var i = 0;
async.whilst(
	function () {
		return i <= messages.length - 1;
	},
	function (innerCallback) {
		sendResponse(sender, messages[i], function () {
			setTimeout(function () {
				i++;
				innerCallback();
			}, 1000);
		})
	}, callback);
}

}
 
function handleApiAiResponse(sender, response, callback) {

    // Do we have a result?
    if (misc.isDefined(response.result)) {

        console.log("Response is:" + JSON.stringify(response));
        
		// Load messages
        var messages = response.result.fulfillment.messages;    
	if(messages)
	{
var i = 0;
async.whilst(
	function () {
		return i <= messages.length - 1;
	},
	function (innerCallback) {
		sendResponse(sender, messages[i], function () {
			setTimeout(function () {
				i++;
				innerCallback();
			}, 1000);
		})
	}, callback);
    }
	    
    }
}

/**
 * Send a response based on the message type
 *
 * @param sender The ID of the user messaging with Maia.
 * @param message Message to send to API.AI.
 * @param callback Callback function.
 */

function sendResponse(sender, message, callback) {

	console.log ("Message type is:" + message.type);
    switch (message.type) {
        case 0: // message text
            fbClient.sendSplitMessages(sender, message.speech);
            break;
        case 1: // card
            var buttons = [];
            if (misc.isDefined(message.buttons)) {
                async.eachSeries(message.buttons, (button, innerCallback) => {
                    var payload = button.postback || button.text;
                    if (payload.match(/http(s)?\:\/\/.*$/)) {
                        buttons.push({
                            type: "web_url",
                            title: button.text,
                            url: payload
			    //webview_height_ratio: "compact"
                	    //messenger_extensions: "true"
                            //fallback_url: "false"			    
			});
                    } else {
                        buttons.push({
                            type: "postback",
                            title: button.text,
                            payload: payload
                        });
                    }

                    console.info(buttons);
                    innerCallback();
                });
            }
            fbClient.sendCardMessage(sender, message.title, message.subtitle, message.imageUrl, buttons);
            break;
        case 2: // quick replies
            if (misc.isDefined(message.replies)) {
                var questions = [];
                async.eachSeries(message.replies, (reply, innerCallback) => {
                    questions.push({text: reply, payload: reply});
                    innerCallback();
                });
	    
		//console.log ("QUICK REPLY MESSAGE IS:" + JSON.stringify(message));
                fbClient.sendQuickReplyQuestion(sender, message.title, questions);
            }
            break;
        case 3: // image
            if (misc.isDefined(message.imageUrl)) {
                fbClient.sendImageMessage(sender, message.imageUrl);
            }
            break;
		    
	 case 4: // Himant added quickreply with location
           	    
		//var messageQ = JSON.parse(message);
		console.log ("text:" + message.payload.facebook.text);
		console.log ("QUICK REPLY MESSAGE IS:" + JSON.stringify(message));
		fbClient.sendQuickReplyLocationQuestion(sender);
		// {"payload":{"facebook":{"text":"Please share your location:","quick_replies":[{"content_type":"location"}]}},"type":4}
		    
	    
            break;
    }
    if (callback) {
        callback();
    }
}

// Expoer module functions
module.exports = {
    handleApiAiResponse: handleApiAiResponse,
	sendResponse: sendResponse,
	handleMessages: handleMessages
};
