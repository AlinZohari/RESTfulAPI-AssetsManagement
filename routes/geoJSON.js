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

//------------------------------------------------------------------------------------------------------------------------
/**
 * SQL file: Asset Location Menu Item endpoints
 * L1: List of Assets in Best Condition (Advanced Functionality 2)
 *  - a list of all the assets that have at east one report(at any point in time)
 *    saying that they are in the best condition (via a menu option)
 * L2: Daily Reporting Rates Graph - All Users (Advanced Functionality 2)
 *  - bar graph showing daily reporting rates for the past week(how many reports have been submitted,
 *    how many reports have been submitted with the worst condition values) (as a menu option)
*/
//---------------------------------------------
/**
 * Asset Location App (L1: List of Assets in Best Condition)
 * description: list of all the assets with at least one report saying that they are in the best condition  (via a menu option) 
 * endpoint: assetsInGreatCondition
 * return: json
 */
geoJSON.get('/assetsInGreatCondition', function(req,res){
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
 * Asset Location App (L2: Daily Reporting Rates Graph - All Users)
 * description: graph showing daily reporting rates for the past week (how many reports have been submitted, and how many of these had condition as one of the two 'not working' options) (as a menu option)
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

//-----------------------------------------------------------------------------------------------------------------------
/**
 * SQL file: Condition Assesment Menu Item endpoints
 * S1: User Ranking (Advanced Functionality 1)
 *  - user is given their ranking based on the number of condition reports created
 *    (in comparison to all other users)
 * S2: Add Layer - 5 closest assets (Advanced Functionality 2)
 *  - map layer showing the 5 assets closest to the user's current location, added by any user.
 *    the layer must be added and removed via a menu option.
 *    the user should not be allowed to provide a condition report for these assets
 * S3: Add Layer - last 5 reports, colour coded (Advanced Functionality 2)
 *  - map howing the last 5 reports created by the specific user (colour coded depending on the condition value).
 *    the layer should be added/removed via menu option. The user should not be allowed to provide a condition report for these assets
 * S4: Add Layer - not rated in the last 3 days (Advanced Functionality 2)
 *  - map layer that shows the user;s asstes that the user has not rated in the last 3 days (via menu option)
 *    The user should not be allowed t provide a condition report for these assets
*/
//---------------------------------------------
/**
 * Condition App (S1: User Ranking)
 * description: user is given their ranking (based on condition reports, in comparison to all other users) (as a menu option)
 * endpoint: userRanking/:user_id
 */
geoJSON.get('/userRanking/:user_id', function(req, res){
    pool.connect(function(err,client,done) {
        if(err){
             console.log("Not able to get connection "+ err);
             res.status(400).send(err);
            }
        
        let user_id = req.params.user_id;

        var querystring = "SELECT array_to_json (array_agg(hh)) ";
        querystring += "FROM ";
        querystring += "(SELECT c.rank FROM (SELECT b.user_id, rank()over (ORDER BY num_reports DESC) AS rank ";
        querystring += "FROM "
        querystring += "(SELECT COUNT(*) AS num_reports, user_id FROM cege0043.asset_condition_information GROUP BY user_id) b) c ";
        querystring += "WHERE ";
        querystring += "c.user_id = $1) hh";

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

//---------------------------------------------
/**
 * Condition App (S2: Add Layer - 5 closest assets)
 * description: map layer showing the 5 assets closest to the user’s current location, added by any user.  The layer must be added/removed via a menu option
 * endpoint: userFiveClosestAssets/:latitude/:longitude
 * return: GeoJSON for display purpose
 */
geoJSON.get('/userFiveClosestAssets/:latitude/:longitude', function(req,res){
    pool.connect(function(err,client,done) {
        if(err){
             console.log("Not able to get connection "+ err);
             res.status(400).send(err);
            }

        let latitude = req.params.latitude;
        let longitude = req.params.longitude;
        let location = req.params.location;
        let user_id = req.params.user_id;

        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) AS features ";
        querystring += "FROM ";
        querystring += "(SELECT 'Feature' As type, ST_AsGeoJSON(lg.location)::json AS geometry, ";
        querystring += "row_to_json((SELECT l FROM (SELECT id, asset_name, installation_date) As l )) AS properties ";
        querystring += "FROM ";
        querystring += "(SELECT c.* FROM cege0043.asset_information c ";
        querystring += "INNER JOIN ";
        querystring += "(SELECT id, ST_DISTANCE(a.location, ST_GeomFromText('POINT("+latitude+""+longitude+")',4326)) AS distance ";//check the lat/lng position?
        querystring += "FROM cege0043.asset_information a ";
        querystring += "ORDER BY distance ASC ";
        querystring += "limit 5) b ";
        querystring += "ON c.id = b.id) AS lg) AS f";

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

//---------------------------------------------
/**
 * Condition App (S3: Add Layer - last 5 reports, colour coded)
 * description: map showing the last 5 reports that the user created (colour coded depending on the conditition rating)
 * endpoint: /lastFiveConditionReports/:user_id
 * return: GeoJSON
 */
geoJSON.get('/lastFiveConditionReports/:user_id', function(req,res){
    pool.connect(function(err,client,done) {
        if(err){
             console.log("Not able to get connection "+ err);
             res.status(400).send(err);
            }
        
        let asset_name = req.params.asset_name;
        let condition_description = req.params.condition_description;
        let user_id = req.params.user_id;

        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) AS features ";
        querystring += "FROM ";
        querystring += "(SELECT 'Feature' As type, ST_AsGeoJSON(lg.location)::json AS geometry, ";
        querystring += "row_to_json((SELECT l FROM (SELECT id, user_id, asset_name, condition_description) AS l )) AS properties ";
        querystring += "FROM ";
        querystring += "(SELECT * FROM cege0043.condition_reports_with_text_descriptions WHERE user_id = $1 ";
        querystring += "ORDER BY timestamp DESC ";
        querystring += "limit 5) AS lg) AS f";

        console.log(querystring);
        console.log(user_id);
        
        client.query(querystring,[user_id],function(err,result){
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
 * Condition App (S4: Add Layer - Not rated in the last 3 days)
 * description: App only shows assets and calculates proximity alerts for assets that the user hasn’t already given a condition report for in the last 3 days 
 * so generate a list of the user's assets for which no condition report exists
 * endpoint: /conditionReportMissing/:user_id
 * return: GeoJSON
 */
geoJSON.get('/conditionReportMissing/:user_id', function(req,res){
    pool.connect(function(err,client,done) {
        if(err){
             console.log("Not able to get connection "+ err);
             res.status(400).send(err);
            }
        
        let user_id = req.params.user_id;

        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) AS features ";
        querystring += "FROM ";
        querystring += "(SELECT 'Feature' As type, ST_AsGeoJSON(lg.location)::json AS geometry, ";
        querystring += "row_to_json((SELECT l FROM (SELECT asset_id, asset_name, installation_date, latest_condition_report_date, condition_description) AS l )) AS properties ";
        querystring += "FROM ";
        querystring += "(SELECT * FROM cege0043.asset_with_latest_condition ";
        querystring += "WHERE user_id = $1 AND ";
        querystring += "asset_id NOT IN (";
        querystring += "SELECT asset_id FROM cege0043.asset_condition_information ";
        querystring += "WHERE user_id = $1 AND ";
        querystring += "timestamp > NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-3)) AS lg) AS f";

        console.log(querystring);
        
        client.query(querystring,[user_id],function(err,result){
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

