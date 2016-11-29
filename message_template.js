/* jshint node: true */
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var sync = require('synchronize');
var globals = require('globals');
//var mysql = require('mysql-libmysqlclient') ;
//const fbClient = require('./fb_client');
//const misc = require('./misc');
var async = require('async');

function messageformat(action)
{
var arr1 = [];
	
if(action == "showOfferOptionsToUser" || action == "surprisetalk")
{

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

//sync.await(connection.query('select * from offers', function(err, rows, fields) {

var messages12 = "Text";
	
function getTopOffers(callback) {
    var ret;
	connection.query("SELECT * from offers", function(err, rows, fields) {
        if (err) {
            // You must `return` in this branch to avoid using callback twice.
            return callback(err);
        }

        // Do something with `rows` and `fields` and assign a value to ret.
	ret = rows;
        return callback(null, ret);
    });
}


function handleResult(err, result) {
console.log("In handle result");	
    if (err) {
        // Just an example. You may want to do something with the error.
        console.error(err.stack || err.message);

        // You should return in this branch, since there is no result to use
        // later and that could cause an exception.
        return;
    }
console.log("result:"+JSON.stringify(result));	
return;
    // All your logic with the result.
}

var offer_data = getTopOffers(handleResult);
	
console.log("result12:"+JSON.stringify(offer_data));	

	console.log("result13:"+JSON.stringify(getTopOffers(handleResult)));	

/* function getTopoffers() {
	
var rows = connection.query('select * FROM offers', function(err, result) {
if(err)
{
throw err;
}
else
{
//console.log(result);		
}	
return result;
});
	
console.log("Rows:"+JSON.stringify(rows));
	
	//{
        //    if (err) {
        //        callback(err, null);
        //    } else 
	for (var i in rows) {
         arr1.push({
            "postback":rows[i].description,
            "text":rows[i].offer_name
          })
	}

		messages12 = [{
			"type":1,
			"title":"Top Pick Offers today.",
			"subtitle":"Vamos",
 			"imageUrl":"http://images.hardwarezone.com/upload/files/2013/11/6891939f6d.jpg",
			"buttons":arr1
			//[{"postback":"https://goo.gl/6eFDBP","text":"Facebook 1 hr"},{"postback":"https://goo.gl/sIZCze","text":"Youtube 1 day"},{"postback":"https://goo.gl/G8x0Rq","text":"Clash of Clans"}]
			}]

		console.log("Message1:"+JSON.stringify(messages12));
			
                return messages12;
	        //callback(null, messages12);
  //      });
	
}		

//messages12 = getTopoffers(); 
	
	//{ //This is the final callback

// = content;

console.log("Message2:"+JSON.stringify(getTopoffers()));

//});

return getTopoffers();
*/
	
}								
		
if(action == "UserAcceptance")
{
var messages = [{
	"type":0,
	"speech":"Thanks for your response."
	}]			
return messages;	
}

if(action == "surprisetalk2")
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
