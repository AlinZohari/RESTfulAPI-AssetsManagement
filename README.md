Technical Guide for the API Component

This is a RESTful Data API. The resources are represented as URIs(Uniform Resource Identifiers), and the HTTP methds(GET, POST, PUT, DELETE, etc) are used to interact with these resources. The API uses HTTP status code to indicate the success or failure of the request. The RESTful API is stateless, meaning that each request from the client to the server should contain all the necessary information to process the request.

This repository have javascripts files which contain the endpoints of specific URLs that are used to access and enter new data to the database. This endpoint are mainly the GET and POST methods.<br>
<b>GET</b>: is used to retrieve the data from the database server without making any changes to the server's data <br>
<b>POST</b>: is used to create or modify an existing data in the database server.


<b> Table of Contents </b>
1. System Requirement
2. Deployment
3. Testing
4. File Description
5. Code Reference


<b> 1. System Requirements </b> <br>
* To be able to use the endpoints, it is required to make a connections with the Rocky Linux Server (cloud server). You can use Cyberduck an opoen source application that support variety of transfer protocols including FTP, SFTP (SSH File Transfer Protocol) and many other.

* It is required to be connected to UCL eduroam wifi to be able to access this Linux Server. Alternatively if you are outside UCL campus or not connected to eduroam wifi, you can connected to UCL Remote Access VPN. Here is the link and instruction to download and connected to UCL VPN (https://www.ucl.ac.uk/isd/services/get-connected/ucl-virtual-private-network-vpn)

* It would be recommended to download Postman to test the endpoints particularly for the POST endpoints. Postman is a tool used for testing and debugging HTTP-based APIs. It allows to send HTTP requests to API enspoints, view and manipulate the response data, and test the API's functionality. Here is the link for more informations and instructions to download Postman (https://www.postman.com/downloads/)


<b>2. Deployment </b><br>
1. Clone the source code of API from Github to server at home/studentuser/code by typing in the command line (terminal) window for Linux Server:

cd /home/studentuser/code
git clone https://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@github.com/ucl-geospatial-22-23/cege0043-api-22-23-AlinZohari.git -b main

2. Check if you are in the corect repository: ucl-geospatial-22-23/cege0043-api-22-23-AlinZohari

3. Since this repository uses Node.js application, you now have to initialise a new Node.js project in the current directory by typing <b>'npm init'</b> in the command line. After answer the series of questions about the project, a 'package.json' file will be created in your project directory. This store metadata about you project, as well as a list of dependencies that the project relies on.

4. Next, type in <b>'npm install'</b> to the command line to intall all of the dependencies listed in your 'package.json' file. This is done as to set up a new development environment or to ensure that all the dependencies are up to date before running a project

5. Alternatively, you can install any dependency individually byt typing for example <b>npm install express</b>. The dependencies needed for this repository includes:
 - express
 - pg
 - fs
 - os

6. After installing the required package dependencies, you can start the Node.Js server. You can enter the debug mode throught the command line window by typing:<br>
<b>node dataAPI.js</b>


<b> 3. Testing </b> <br>
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
| longitude | -0.1292555  |
| latitude | 51.5254644 |
<br>

the installation date are in the form of YYYY-MM-DD
If the POST endpoints are succesful and working correctly, Postman will return the program message that the data has been inserted into the database.<br>

* Alternatively, you can check if the data was submitted to the database by simply login to PG Admin and check in CEGE0043 schema and View the table for that particular POST endpoint.

* While testing the functionality of this API repository, use of Inspect or Developer mode of the browser to see if any error occurs.


<b> 4. File Description </b> <br>

