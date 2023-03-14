//CRUD stands for Create,Read,Update,Delete

let express = require('express');
let pg = require('pg');
let crud = require('express').Router();
let fs = require('fs');

let os = require('os');
const userInfo = os.userInfo();
const username = userInfo.username;
console.log(username);

// locate the database login details
let configtext = ""+fs.readFileSync("/home/"+username+"/certs/postGISConnection.js");

// now convert the configruation file into the correct format -i.e. a name/value pair array
let configarray = configtext.split(",");
let config = {};
for (let i = 0; i < configarray.length; i++) {
	let split = configarray[i].split(':');
	config[split[0].trim()] = split[1].trim();
}
let pool = new pg.Pool(config);
console.log(config);
