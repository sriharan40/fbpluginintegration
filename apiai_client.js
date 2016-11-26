/* jshint node: true */
'use strict';

const fbClient = require('./fb_client');
const misc = require('./misc');
const async = require('async');

/**
 * Handles API.AI Responses
 *
 * @param sender The ID of the user messaging with Maia.
 * @param response Response from API.AI.
 * @param callback Callback function.
 */
function handleApiAiResponse(sender, response, callback) {

    // Do we have a result?
    if (misc.isDefined(response.result)) {

        console.log("Response is:" + JSON.stringify(response));
        // Load messages
        var messages = response.result.fulfillment.messages;    
		
		var action = response.result.action;

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
		
		if(messages)
		{
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
}

/**
 * Send a response based on the message type
 *
 * @param sender The ID of the user messaging with Maia.
 * @param message Message to send to API.AI.
 * @param callback Callback function.
 */

function sendResponse(sender, message, callback) {

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
                fbClient.sendQuickReplyQuestion(sender, message.title, questions);
            }
            break;
        case 3: // image
            if (misc.isDefined(message.imageUrl)) {
                fbClient.sendImageMessage(sender, message.imageUrl);
            }
            break;
    }
    if (callback) {
        callback();
    }
}

// Expoer module functions
module.exports = {
    handleApiAiResponse: handleApiAiResponse
};
