# BackEnd: RESTfulAPI for Assets Management Application
Technical Guide for the API Component.<br>
*You can find the FrontEnd Repository of the application [here](https://github.com/AlinZohari/APP-AssetsManagement/tree/main)*

<br>
This is a RESTful Data API. The resources are represented as URIs(Uniform Resource Identifiers), and the HTTP methds(GET, POST, PUT, DELETE, etc) are used to interact with these resources. The API uses HTTP status code to indicate the success or failure of the request. The RESTful API is stateless, meaning that each request from the client to the server should contain all the necessary information to process the request.

This repository have javascripts files which contain the endpoints of specific URLs that are used to access and enter new data to the database. This endpoint are mainly the GET and POST methods.<br>
<b>GET</b>: is used to retrieve the data from the database server without making any changes to the server's data <br>
<b>POST</b>: is used to create or modify an existing data in the database server.

**Table of Contents**
1. [System Requirement](https://github.com/AlinZohari/RESTfulAPI-AssetsManagement?tab=readme-ov-file#system-requirements)
2. [Deployment](https://github.com/AlinZohari/RESTfulAPI-AssetsManagement?tab=readme-ov-file#deployment)
3. [Testing](https://github.com/AlinZohari/RESTfulAPI-AssetsManagement?tab=readme-ov-file#testing)
4. [File Description](https://github.com/AlinZohari/RESTfulAPI-AssetsManagement?tab=readme-ov-file#file-description)
5. [Code Reference](https://github.com/AlinZohari/RESTfulAPI-AssetsManagement?tab=readme-ov-file#code-reference)


## System Requirements
* To be able to use the endpoints, it is required to make a connections with the Rocky Linux Server (cloud server). You can use Cyberduck an opoen source application that support variety of transfer protocols including FTP, SFTP (SSH File Transfer Protocol) and many other.

* It is required to be connected to UCL eduroam wifi to be able to access this Linux Server. Alternatively if you are outside UCL campus or not connected to eduroam wifi, you can connected to UCL Remote Access VPN. Here is the link and instruction to download and connected to UCL VPN (https://www.ucl.ac.uk/isd/services/get-connected/ucl-virtual-private-network-vpn)

* It would be recommended to download Postman to test the endpoints particularly for the POST endpoints. Postman is a tool used for testing and debugging HTTP-based APIs. It allows to send HTTP requests to API enspoints, view and manipulate the response data, and test the API's functionality. Here is the link for more informations and instructions to download Postman (https://www.postman.com/downloads/)


## Deployment
1. Clone the source code of API from Github to server at home/studentuser/code by typing in the command line (terminal) window for Linux Server:

2. Check if you are in the corect repository: ucl-geospatial-22-23/cege0043-api-22-23-AlinZohari

3. Since this repository uses Node.js application, you now have to initialise a new Node.js project in the current directory by typing <b>'npm init'</b> in the command line. After answer the series of questions about the project, a 'package.json' file will be created in your project directory. This store metadata about you project, as well as a list of dependencies that the project relies on.

4. Next, type in <b>'npm install'</b> to the command line to intall all of the dependencies listed in your 'package.json' file. This is done as to set up a new development environment or to ensure that all the dependencies are up to date before running a project

5. Alternatively, you can install any dependency individually byt typing for example <b>npm install express</b>. The dependencies needed for this repository includes:
 - express: for setting up the API
 - pg: for PostgreSQL connectivity
 - fs: for file system related functionailty
 - os: for operating system related functionality

6. After installing the required package dependencies, you can start the Node.Js server. You can enter the debug mode throught the command line window by typing:<br>
<b>node dataAPI.js</b>


## Testing
* Ensure that you are connected to UCL wifi or UCL VPN and the node.JS server is active

* To test the <b>GET</b> Request Endpoints: <br>
Type in the URL in the browser and the output will be returned. For example: <br>
i. getting the user id using the /userId endpoint, type the following in the browser: https://cege0043-34.cs.ucl.ac.uk/api/userId <br>
ii. some GET endpoint require you to enter the user id such as the userAssets/:user_id endpoint, type the following in the browser:<br>
 https://cege0043-34.cs.ucl.ac.uk/api/userAssets/721

* To test the <b>POST</b> Request Endpoints: <br>
You need to use Postman to test the POST endpoints as the endpoint needed you to enter data to the database server. You are required to enter the parameter and the data manually in BODY> x-www-form-unencoded <br>

For example:<br>
i. to test /insertAssetPoint endpoint the parameter and data as follows:<br>

| Key  | Value |
| ------------- | ------------- |
| asset_name  | hi |
| installation_date | 2023-04-21 |
| latitude | 51.5254644 |
| longitude | -0.1292555  |

<br>

The installation date are in the form of YYYY-MM-DD
If the POST endpoints are succesful and working correctly, Postman will return the program message that the data has been inserted into the database.<br>

* Alternatively, you can check if the data was submitted to the database by simply login to PG Admin and check in CEGE0043 schema and View the table for that particular POST endpoint.

* While testing the functionality of this API repository, use of Inspect or Developer mode of the browser to see if any error occurs.


## File Description
In this repository there are three files that are needed for the Node.Js Server to work and endpoints to succesfully run. This include:
1. dataAPI.js
2. crud.js (in routes folder)
3. geoJSON.js (in routes folder)


<b>4.1 dataAPI.js</b><br>
dataAPI.js cretaes a NOde.js server which creates an HTTP server to listedn to incoming requests on port 4480.
The server uses the Express framework, which provides a set of tools for building web applications and APIs.
dataAPI.js defines two middleware functions which are crud.js and geoJSON.js that will be used for every incoming request. The server starts listening for incoming requests on port 4480 using the 'httpServer.listen()' method.

<b> 4.2 crud.js</b><br>
crud.js sets up an API with CRUD(Create, Read, Update, Delete) functionality formanaging data sorted in a PostgreSQL database. It reads the database login details from configuration file and creates a PostgreSQL connection pool. crud.js has endpoint for both GET and POST requests, and additional endpoints for CRUD operations, including:<br>

| Reference   | Endpoint                  | Description
|------|---------------------------|----------------------------|
| NA   | /userId    | A GET endpoint for retrieving the user_id from the database based on the current logged in user.|
| A1 | /insertAssetPoint | A POST endpoint for inserting an asset point into the database. It is used to insert asset informations such as asset_name, installation_date, latitude, longitude into the database. |
| A1 | /insertConditionInformation | A POST endpoint for inserting condition assessment information into the database.|

<br>

These endpoints use SQL queries to interact with the database, and the data to be inserted or retrieved are parsed from the HTTP request data using 'body-parser'. 


<b> 4.3 geoJSON.js </b> <br>
geoJSON.js uses Node.js and the Ecpress framework to create RESTful endpoints that return json and geojson data from the PostgresSQL database. endpoints in  geoJSON.js are all a GET requests. These endpoint includes: <br>

| Reference     | Endpoint                | Description
| ------ | ----------------------- | -------------------------------------|
| A0     | /conditionDetails | A GET endpoint which return a JSON array containing objects that describe different coditions of an element. Each object in the array wo properties - "id" and "condition_description". The "id" property is a unique identifier for the condition, while the "condition_description" property provides a description of the condition.|
| A2     | /userAssets/:user_id  | A GET endpoint which return GeoJSON file. The endpoint use user_id as an input and returns geoJSON containing asset_id, asset_name, installation_date, latest_condition_report_date and condition_description. it also includes the coordinate (latitude andlongitude) of the asset|
| A3     | /userConditionReports/:user_id | A GET endpoint which return JSON object containing a single key-value pair. This endpoint takes user_id as input and returns the number of reports submitted by that particular user (num_reports) |
| L1 | /assetsInGreatCondition | A GET endpoint which return JSON list of assets which are in great condition any point in time (i.e. condition value of 1: "Element is in very good condition") atleast once submitted by any user of the database|
| L2 | /dailyParticipationRates | A GET endpoint which return JSON array with a single object that contains an array with seven objects, each of which represents a day of the week along with the number of reports submitted and not working on that day (i.e. have condition value of 4 or 5:Not working and maintenance must be done as soon as reasonably possible or Not working and needs immediate, urgent maintenance) |
| S1 | /userRanking/:user_id | A GET endpoint which return JSON array  that contains a single object with a key-value pair. This endpoint takes user_id as input and returns the user ranking based on the number of reports the user has submitted |
| S2 | userFiveClosestAssets/:latitude/:longitude | A GET endpoint which return GeoJSON data structure that represents a collection of features, where each feature represents a point on a map. This endpoint takes latitude and longitude of user's position as input to calculate the five closest assets from user's location and returns array_to_json of five closest assets which includes the assets' id, asset_name and installation_date|
| S3 | /lastFiveConditionReports/:user_id | A GET endpoint which return  a JSON object that represents a feature collection of points geometry (coordinates) with properties. Each point represents an asset, and the properties describe the asset's details, such as its. This endpoint takes user_id as input and returns the last five reports that the user created.   The properties of the assets include id, user_id, asset_name and condition_description|
| S4 | /conditionReportMissing/:user_id | A GET endpoint which return GeoJSON. The endpoin takes user_id as input and returns assets that the user has not already given a condition report for in the last 3 days|
<br>

## Code Reference
* A large proportion of codes are adapted from the practical notes, lecture and example code in ucl-geospatial example repository of CEGE0043 Web and Mobile GIS by Calire Ellul.

* The adaptation of the query to generate the necessary geoJSON format was done with reference to this source: http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html.



