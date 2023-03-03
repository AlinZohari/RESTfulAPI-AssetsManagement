"use strict";

//this is when it use the packages store in express: node install express --save
 const express = require('express');
 const pg = require('pg');
 const geoJSON = require('express').Router();
 const fs = require('fs');

//get the username - this will ensure that we can use the same code on multiple machines
 const os = require('os');
 const userInfo = os.userInfo();
 const username = userInfo.username;
 console.log(username);
 const configtext = ""+fs.readFileSync("/home/" +username+ "/certs/postGISConnection.js");
 
//now convert the configuration file into the correct format -i.e. a name/value pair array
 const configarray = configtext.split(",");
 let config = {};
 for (let i = 0; i < configarray.length; i++) {
     let split = configarray[i].split(':');
     config[split[0].trim()] = split[1].trim();
 }

//create a PostgreSQL connection pool using pg package
// A connection pool is a cache of database connections maintained so that the connections can be reused when needed,
//instead of creating a new connection every time one is needed
 const pool = new pg.Pool(config);
 console.log(config);


//simple test to show that the route is working
geoJSON.route('/testGeoJSON').get(function (req,res) {
 res.json({message:req.originalUrl});
 });

//extending geoJSON code to run simple query - returning all the data in a table
geoJSON.get('/postgistest', function (req,res) {
    pool.connect(function(err,client,done) {
        if(err){
             console.log("not able to get connection "+ err);
             res.status(400).send(err);
        } 
    client.query(' select * from information_schema.columns' ,function(err,result) {
        done(); 
        if(err){
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
    });
});
  
//getSensors
geoJSON.get('/getSensors', function (req,res) {
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        } 
        let querystring = " SELECT 'FeatureCollection' As type,     array_to_json(array_agg(f)) As features FROM ";
        console.log(querystring);
        querystring = querystring + "(SELECT 'Feature' As type , ST_AsGeoJSON(st_transform(lg.location,4326))::json As geometry, ";
        console.log(querystring);
        querystring = querystring + "row_to_json((SELECT l FROM (SELECT sensor_id, sensor_name, sensor_make, sensor_installation_date, room_id) As l )) As properties";
        console.log(querystring);
        querystring = querystring + " FROM ucfscde.temperature_sensors As lg limit 100 ) As f"; 
        console.log(querystring);
        client.query(querystring,function(err,result) {
            done(); 
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

//this has to be at the bottom- export function so that the route can be published to the dataAPI.js server
module.exports = geoJSON;

