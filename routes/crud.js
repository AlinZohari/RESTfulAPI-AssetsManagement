//CRUD stands for Create,Read,Update,Delete

"use strict";

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
let user_id;

// now convert the configruation file into the correct format -i.e. a name/value pair array
let configarray = configtext.split(",");
let config = {};
for (let i = 0; i < configarray.length; i++) {
	let split = configarray[i].split(':');
	config[split[0].trim()] = split[1].trim();
}
let pool = new pg.Pool(config);
console.log(config);

//add data parser functionality to the API
//so that the NodeJS code can read through the individual name/value pairs that are posted by the form
const bodyParser = require('body-parser');
crud.use(bodyParser.urlencoded({ extended: true }));


//adding a route called /testCRUD with two endpoints -one for the GET and one for POST
// test endpoint for GET requests (can be called from a browser URL or AJAX)
crud.get('/testCRUD',function (req,res) {
res.json({message:req.originalUrl+" " +"GET REQUEST"});
});

// test endpoint for POST requests - can only be called from AJAX
crud.post('/testCRUD',function (req,res) {
res.json({message:req.body});
});


//creating endpoints for assignment 5 requirement start here - adapt, reference and with the help of SQL file in moodle by Claire Ellul
//---------------------------------------------------------------------------------------------------------------
//creating CRUD to get user_id
crud.get('/userId',function(req,res){
	pool.connect(function(err,client,done){
		if(err){
			console.log("Not able to get connection" + err);
			res.status(400).send(err);
		}

		let querystring = "SELECT user_id FROM ucfscde.users WHERE user_name = current_user";
		console.log(querystring)
		client.query(querystring, function(err,result){
			done();
			if(err){
				res.status(400).send(err);
			}
			res.status(200).send(result.rows[0]);
			let user_id = result.rows[0].user_id;
			console.log(user_id);
		});
	});
});

//A1 crud.post for /insertAssetPoint -------------------------------------------
crud.post('/insertAssetPoint', function(req,res){
	pool.connect(function(err,client,done){
		if(err){
			console.log("Not able to get connection" + err);
			res.status(400).send(err);
			}
			
			let asset_name = req.body.asset_name;
			let installation_date = req.body.installation_date;
			let latitude = req.body.latitude;
			let longitude = req.body.longitude;
			let location = req.body.location;

			var geometrystring = "ST_GeomFromText('POINT("+req.body.latitude+" "+req.body.longitude+")',4326)";
			//inserting new record usind INSERT INTO (*tablenames*) VALUES (*value1, value2, value3...*)
			var querystring = "INSERT INTO cege0043.asset_information(asset_name, installation_date, location) VALUES ";
			querystring += "($1,$2,";
			querystring += geometrystring +")";

			console.log(querystring);
			client.querystring(querystring,[asset_name, installation_date], function (err, result){
				done();
				if(err){
					res.status(400).send(err);
				}
				res.status(200).send("Thank you.\n Asset: "+req.body.asset_name+ "has been created");
			});
	});
});

// A1 crud.post for /insertConditionInformation -------------------------------------
crud.post('/insertConditionInformation', function(req,res){
	console.log(req.body);
	pool.connect(function(err,client,done){
		if(err){
			console.log("Not able to get connection" + err);
			res.status(400).send(err);
			}

			let asset_name = req.body.asset_name;
			let condition = req.body.condition;
			let condition_description = req.body.condition_description;
			let asset_id = req.body.asset_id;

			var querystring = "INSERT INTO cege0043.asset_condition_information(asset_id, condition_id) VALUES(";
			querystring += "(SELECT id FROM cege0043.asset_information WHERE asset_name = $1), (SELECT id FROM cege0043.asset_condition.options WHERE condition.description = $2))";
			console.log(querystring);
			client.query(querystring,[asset_name, condition_description], function(err, result){
				done();
				if(err){
					console.log(err);
					res.status(400).send(err);
				}
				res.status(200).send("Thank you. \n Condition Assesment for "+req.body.asset_name+" has been submitted.");
		});
	});
});


//this line should be always at the end of the file
module.exports = crud;