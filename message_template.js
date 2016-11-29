/* jshint node: true */
'use strict';

const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const request = require('request');
const mysql = require('mysql');
const JSONbigint = require('json-bigint');
const fbClient = require('./fb_client');
const apiaiClient = require('./apiai_client');
const messag = require('./message_template');
const misc = require('./misc');
const async = require('async');

function messageformat(action,sender)
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

var messages12 = [{
	"type":1,
	"title":"Top Pick Offers today.",
	"subtitle":"Vamos",
	"imageUrl":"http://images.hardwarezone.com/upload/files/2013/11/6891939f6d.jpg",
	"buttons":arr1
	}]

console.log("Message1:"+JSON.stringify(messages12));
	  
fbClient.handleMessages(messages12,sender,"");

}
  
});	
	
}								
		
if(action == "UserAcceptance")
{
var messages = [{
	"type":0,
	"speech":"Thanks for your response."
	}]			
apiaiClient.handleMessages(messages,sender,"");	
}

if(action == "surprisetalk2")
{
var messages = [{
	"type":0,
	"speech":"Welcome to bot chat."
	}]
apiaiClient.handleMessages(messages,sender,"");	
}
		
}	

// Export module functions
module.exports = {
    messageformat: messageformat
};
