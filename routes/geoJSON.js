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

//creating endpoints for assignment 5 requirement start here - adapt, reference and with the help of SQL file in moodle by Claire Ellul
//---------------------------------------------------------------------------------------------
/**
 * endpoint: geoJSONUserId/:user_id
 * input takes:user_id
 * return: (geojson) asset_id, asset_name, installation_date,condition_description
 */
geoJSON.get('/geoJSONUserId/:user_id', function(req,res){
    pool.connect(function(err,client,done) {
        if(err){
             console.log("Not able to get connection "+ err);
             res.status(400).send(err);
        } 
        let user_id = req.params.user_id;
        let colnames = "asset_id,asset_name, installation_date, condition_description";

        //create the required geoJSON format using a query adapted from here:
        //http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html

        let querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ";
        querystring += "(SELECT 'Feature' As type , ST_AsGeoJSON(lg.location)::json As geometry, "; //do we need st_transform?
        querystring += "row_to_json((SELECT l FROM (SELECT "+colnames+") As l )) As properties ";
        querystring += "FROM cege0043.asset_with_latest_condition As lg ";
        querystring += "WHERE user_id = $1 limit 100 ) As f";
        
        console.log(querystring);
        console.log(user_id);
        
        client.query(querystring,function(err,result){
            done(); 
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

//------------------------------------------------------------------------------------------------------
/**
 * SQL file: Asset Location Menu Item endpoints
 * L1: List of Assets in Best Condition
 *  - a list of all the assets that have at east one report(at any point in time)
 *    saying that they are in the best condition (via a menu option)
 * L2: Daily Reporting Rates Graph - All Users
 *  - bar graph showing daily reporting rates for the past week(how many reports have been submitted,
 *    how many reports have been submitted with the worst condition values) (as a menu option)
*/
//---------------------------------------------
/**
 * L1: List of Assets in Best Condition (Advanced Functionality 2)
 * endpoint: assetsInGreatCondition
 * return: json
 */
geoJSON.get('assetsInGreatCondition', function(req,res){
    pool.connect(function(err,client,done) {
        if(err){
             console.log("Not able to get connection "+ err);
             res.status(400).send(err);
        }
        
        var querystring = "SELECT array_to_json (array_agg(d)) FROM ";
        querystring += "(SELECT c.* FROM cege0043.asset_information c ";
        querystring += "INNER JOIN ";
        querystring += "(SELECT COUNT(*) AS best_condition, asset_id FROM cege0043.asset_condition_information "
        querystring += "WHERE "; 
        querystring += "condition_id IN (SELECT id FROM cege0043.asset_condition_options WHERE condition_description LIKE '%very good%') "
        querystring += "GROUP BY asset_id "
        querystring += "ORDER BY best_condition DESC) b "
        querystring += "ON b.asset_id = c.id) d" ;
        
        console.log(querystring)

        client.query(querystring,function(err,result){
            done(); 
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});
//---------------------------------------------
/**
 * L2: Daily Reporting Rates Graph - All Users (Advanced Functionality 2)
 * endpoint: dailyParticipationRates
 * return: json
 */
geoJSON.get('/dailyParticipationRates', function(req,res){
    pool.connect(function(err,client,done) {
        if(err){
             console.log("Not able to get connection "+ err);
             res.status(400).send(err);
        }

        let day = req.params.day;
        let reports_submitted = req.params.reports_submitted;
        let not_working = req.params.not_working;

        var querystring = "SELECT  array_to_json (array_agg(c)) FROM "; 
        querystring += "(SELECT day, SUM(reports_submitted) As reports_submitted, ";
        querystring += "SUM(not_working) AS reports_not_working ";
        querystring += "FROM cege0043.report_summary ";
        querystring += "GROUP BY day) c";

        console.log(querystring);
        
        client.query(querystring,function(err,result){
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

