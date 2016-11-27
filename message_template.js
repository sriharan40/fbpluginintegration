/* jshint node: true */
'use strict';
var mysql = require('mysql');
const fbClient = require('./fb_client');
const misc = require('./misc');
const async = require('async');

function messageformat(action)
{	
if(action == "showOfferOptionsToUser")
{
var arr1 = [];

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

connection.query('select * from offers', function(err, rows, fields) {
    if (err) throw err; 
    for (var i in rows) {
         arr1.push({
            //"type":"web_url",
            "postback":rows[i].description,
            "text":rows[i].offer_name
          })
    }			
		var messages = [{
			"type":1,
			"title":"Top Pick Offers today.",
			"subtitle":"Vamos",
 			"imageUrl":"http://images.hardwarezone.com/upload/files/2013/11/6891939f6d.jpg",
			"buttons": [
			{
				"postback":"https://goo.gl/6eFDBP",
				"text":"Facebook 1 hr"
			},
			{
				"postback":"https://goo.gl/sIZCze",
				"text":"Youtube 1 day"
			}
			]
			//arr1
			}]

console.log("Message:"+JSON.stringify(messages));

return messages;

console.log("Message:"+JSON.stringify(messages));

		});
}		
		
		if(action == "UserAcceptance")
		{
		var messages = [{
			"type":0,
			"speech":"Thanks for your response."
			}]			
return messages;			
		}

		if(action == "surprisetalk")
		{
		var messages = [{
			"type":0,
			"speech":"Welcome to bot chat."
			}]	
return messages;			
		}
		
}	

// Export module functions
module.exports = {
    messageformat: messageformat,
};	
