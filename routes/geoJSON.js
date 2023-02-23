"use strict";
const express = require('express');
const pg = require('pg');
const geoJSON = require('express').Router();
const fs = require('fs');

//get the username - this will ensure that we can use the same code on multiple machines
const os = require('os');
const userInfo = os.userInfo();
const username = userInfo.username;
console.log(username);
//locate the database login details
const configtext = "" + fs.readFileSync("/home/"+username+"/code/cege0043-api-22-23-AlinZohari/certs/postGISConnection.js");

//now convert the configuration file into the correct format -i.e. a name/value pair array
const configarray = configtext.split(",");
let config = {};
for (let i = 0; i < configarray.length; i++) {
 let split = configarray[i].split(':');
 config[split[0].trim()] = split[1].trim();
}
const pool = new pg.Pool(config);
console.log(config);


//simple test to show that the route is working
geoJSON.route('/testGeoJSON').get(function(req,res){
	res.json({message:req.originalUrl});
});

//export function so that the route can be published to the dataAPI.js server
module.exports = geoJSON;

