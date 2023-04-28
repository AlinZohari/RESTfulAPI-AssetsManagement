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


<b> 2. Deployment </b>




