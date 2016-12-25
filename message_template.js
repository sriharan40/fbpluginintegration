/* jshint node: true */
'use strict';

const fbClient = require('./fb_client');
const apiaiClient = require('./apiai_client');
const misc = require('./misc');
const async = require('async');
const mysql = require('mysql');

/*global.window.fbAsyncInit = function() {
    FB.init({
      appId      : '312339728800370',
      xfbml      : true,
      version    : 'v2.7'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
*/

function messageformat(action,sender,response)
{
var arr1 = [];
var messages12 = "";

console.log("Actions:"+action);

switch (action) {
	
case "showOfferOptionsToUser":

var db_config = {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: process.env.db_user,
    password: process.env.db_pass,
    database: 'heroku_a0067bd7c868fc0'
};


var connection;

    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });

connection.query("select * from offers", function(err, rows){
  if(err) {
    throw err;
  } else {
	  
for (var i in rows) {
	 arr1.push({
		"postback":rows[i].description,
		"text":rows[i].offer_name
	  })
}	  

connection.query('select * from category', function(err, rows12) {

var messages12 = [{
	"type":1,
	"title":rows12[0].title,
	"subtitle":rows12[0].sub_title,
	"imageUrl":rows12[0].img_url,
	"buttons":arr1
	}]

console.log("Message1:"+JSON.stringify(messages12));

var i = 0;
async.whilst(
	function () {
		return i <= messages12.length - 1;
	},
	function (innerCallback) {
		apiaiClient.sendResponse(sender, messages12[i], function () {
			setTimeout(function () {
				i++;
				innerCallback();
			}, 1000);
		})
	}, "");

//fbClient.sendCardMessage(sender, messages12.title, messages12.subtitle, messages12.imageUrl, messages12.buttons);
//apiaiClient.handleMessages(messages12,sender,"");
	  
});  

}

});

break;

case "surprisetalk":
var db_config = {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: process.env.db_user,
    password: process.env.db_pass,
    database: 'heroku_a0067bd7c868fc0'
};

var connection;

    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });

connection.query("select * from offers", function(err, rows){
  if(err) {
    throw err;
  } else {
	  
for (var i in rows) {
	 arr1.push({
		"postback":rows[i].description,
		"text":rows[i].offer_name
	  })
}	  

connection.query('select * from category', function(err, rows12) {

var messages12 = [{
	"type":1,
	"title":rows12[0].title,
	"subtitle":rows12[0].sub_title,
	"imageUrl":rows12[0].img_url,
	"buttons":arr1
	}]

console.log("Message1:"+JSON.stringify(messages12));

var i = 0;
async.whilst(
	function () {
		return i <= messages12.length - 1;
	},
	function (innerCallback) {
		apiaiClient.sendResponse(sender, messages12[i], function () {
			setTimeout(function () {
				i++;
				innerCallback();
			}, 1000);
		})
	}, "");
	
//fbClient.sendCardMessage(sender, messages12.title, messages12.subtitle, messages12.imageUrl, messages12.buttons);
//apiaiClient.handleMessages(messages12,sender,"");
	  
});  

}

});

break;

case "UserAcceptance":

/* FB.AppEvents.logEvent("UserAcceptance"); */	
var messages = [{
	"type":0,
	"speech":"Thanks for your response."
	}]	
apiaiClient.sendResponse(sender, messages[0], "");
//apiaiClient.handleMessages(messages,sender,"");	
break;

// case for recharge amount 
case "rechargeAction" :

// Generate the speech 
// if total amount is < requested, say, you do not have enough amount. 

// If recharge amount < total available, show remaining available.
var messages = [{
	"type":0,
	"speech":"Your payment was submitted successfully."
	}]	
// Send message to apiaiclient.
apiaiClient.sendResponse(sender, messages[0], "");
break;
		
// case for recharge ends
case "myparam":

/* FB.AppEvents.logEvent("UserAcceptance"); */	
var messages = [{
	"type":0,
	"speech":"Your payment was submitted successfully."
	}]	
apiaiClient.sendResponse(sender, messages[0], "");
//apiaiClient.handleMessages(messages,sender,"");	
break;
		
case "surprisetalk2":

var messages = [{
	"type":0,
	"speech":"Welcome to bot chat."
	}]
apiaiClient.sendResponse(sender, messages[0], "");
//apiaiClient.handleMessages(messages,sender,"");	

break;

case "showOptionsToUser":
//messages[0].type = 
apiaiClient.handleApiAiResponse(sender, response, "")
//apiaiClient.sendResponse(sender, messages[0], "");
console.log ("Options shown to user");
break;

default:

//var speech = response;
	var messages = [{
	"type":0,
	"speech":response.result.fulfillment.messages.speech
	}]
	console.log ("Speech to send back is :" + JSON.stringify(response));

	apiaiClient.sendResponse(sender, messages[0], "");

//fbClient.sendSplitMessages(sender, response.result.fulfillment.messages);
//apiaiClient.handleApiAiResponse(sender, response);	

break;

}
	
}	

// Export module functions
module.exports = {
    messageformat: messageformat
};
