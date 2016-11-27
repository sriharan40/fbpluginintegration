/* jshint node: true */
'use strict';

const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const request = require('request');
const JSONbigint = require('json-bigint');
const fbClient = require('./fb_client');
const apiaiClient = require('./apiai_client');
const misc = require('./misc');
const async = require('async');
const messag = require('./message');

const REST_PORT = (process.env.PORT || 5000);
const APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN;
const APIAI_LANG = process.env.APIAI_LANG || 'en';
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

// Create apiai service
const apiAiService = apiai(APIAI_ACCESS_TOKEN, {language: APIAI_LANG, requestSource: "fb"});
const sessionIds = new Map();

/**
 * Process an incoming event from facebook
 *
 * @param event
 */
 
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

		if(action == "Surprisetalk")
		{
		var messages = [{
			"type":0,
			"speech":"Welcome to bot chat."
			}]			
		}
		
return messages;
}		
 
function jsonvalue(json,string)
{	
for (var name in json) {
if(name == string)
{
var ref = json[name];
}
if(typeof json[name] == 'object')
{
for (var name1 in json[name]) {
if(name1 == string)
{	
   var ref = json[name][name1];
}   
if(typeof json[name][name1] == 'object')
{
for (var name2 in json[name][name1]) {
if(name2 == string)
{	
   var ref = json[name][name1][name2];
}   
if(typeof json[name][name1][name2] == 'object')
{
for (var name3 in json[name][name1][name2]) {
if(name3 == string)
{
   var ref = json[name][name1][name2][name3];
}   
if(typeof json[name][name1][name2][name3] == 'object')
{
for (var name4 in json[name][name1][name2][name3]) {
if(name4 == string)
{
   var ref = json[name][name1][name2][name3][name4];
}
if(typeof json[name][name1][name2][name3][name4] == 'object')
{
for (var name5 in json[name][name1][name2][name3][name4]) {
if(name5 == string)
{
	var ref = json[name][name1][name2][name3][name4][name5];
}
if(typeof json[name][name1][name2][name3][name4][name5] == 'object')
{
for (var name6 in json[name][name1][name2][name3][name4][name5]) {
if(name6 == string)
{
   var ref = json[name][name1][name2][name3][name4][name5][name6];
}
   }   
 }
 }   
 }
 }   
 }
 }   
 }
 }   
 }
 }   
 }	
 }	
return ref; 
}
 
function processFacebookEvent(event) {

    // Get sender id
    var sender = event.sender.id.toString();    

	var ref = jsonvalue(event,'ref');
	
	if(ref)
	{
	var messages = messageformat(ref);
	
if(messages)
{		
// Adding delay between responses
var i = 0;

		console.log("message:"+JSON.stringify(messages[i]));

		apiaiClient.sendResponse(sender, messages[i], function () {
		console.log("message:"+JSON.stringify(messages));	
		});
}		
	
    //fbClient.sendSplitMessages(sender, ref);
	
	}	
	else
	{
    var text = "";
    if (event.message && event.message.text) {
        text = event.message.text;
    } else if (event.postback && event.postback.payload) {
        text = event.postback.payload;
    }

    if (text) {

        // Store a new session for this sender
        if (!sessionIds.has(sender)) {
            sessionIds.set(sender, uuid.v1());
        }

        fbClient.userInfoRequest(sender)
            .then(userInfoStr=> {
                // Initialize userInto
                var userInfo = {first_name: "friend"};
                try {
                    userInfo = JSON.parse(userInfoStr);
                } catch (err) {
                    console.error("Could not parse userInfoStr: %s", userInfoStr)
                }
                var apiaiRequest = apiAiService.textRequest(text,
                    {
                        sessionId: sessionIds.get(sender),
                        contexts: [
                            {
                                name: "generic",
                                parameters: {
                                    facebook_user: userInfo.first_name,
                                }
                            }
                        ]
                    });

                // Handle response
                apiaiRequest.on('response', response => {
                    apiaiClient.handleApiAiResponse(sender, response);
                });
                apiaiRequest.on('error', error => console.error(error));
                apiaiRequest.end();

            }).catch(err => {
            console.error(err);
        });
    }

	}
}


// Create Express Server
const app = express();

// Enable json parsing
app.use(bodyParser.text({type: 'application/json'}));

// Main webhook endpoint configuration
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] == FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);

        setTimeout(function () {
            fbClient.subscribeRequest();
        }, 3000);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.post('/webhook/', function (req, res) {
    try {
        // Load data
        var data = JSONbigint.parse(req.body);
        
        console.log("Data:"+req.body);
			
        for (var i = 0; i < data.entry[0].messaging.length; i++) {
            var event = data.entry[0].messaging[i];
            processFacebookEvent(event);
        }
        return res.status(200).json({
            status: "ok"
        });
    } catch (err) {
        return res.status(400).json({
            status: "error",
            error: err
        });
    }

});

// For testing purposes (testing api.ai-like callback posts)
app.post('/test-apiai-callback/', function (req, res) {
    try {
        // Load data
        var data = JSONbigint.parse(req.body);

        // Forward data to Api.AI
        apiaiClient.handleApiAiResponse('1217505768324329', data);

        return res.status(200).json({
            status: "ok"
        });
    } catch (err) {
        return res.status(400).json({
            status: "error",
            error: err
        });
    }
});

// Start web server
app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});

// Subscribe
fbClient.subscribeRequest();
