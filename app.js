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
const messag = require('./message_template');
const misc = require('./misc');
const async = require('async');

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
  
function processFacebookEvent(event) {

// Get sender id
var sender = event.sender.id.toString();    

var ref = fbClient.jsonvalue(event,'ref');

if(ref)
{
var messages = messag.messageformat(ref,sender);

var callback = "";
	
if(messages)
{		
        // Adding delay between responses
        var i = 0;
        async.whilst(
            function () {
                return i <= messages.length - 1;
            },
            function (innerCallback) {
                apiaiClient.sendResponse(sender, messages[i], function () {
                    setTimeout(function () {
                        i++;
                        innerCallback();
                    }, 1000);
                })
            }, callback);
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
                var userInfo = {first_name: "friend", devices: "devices"};
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
				    devices: userInfo.devices	
                                }
                            }
                        ]
                    });

                // Handle response
                apiaiRequest.on('response', response => {
                    
					console.log("Response is:" + JSON.stringify(response));
					
					//apiaiClient.handleApiAiResponse(sender, response);
							
					var action = response.result.action;

					messag.messageformat(action, sender);
		
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
