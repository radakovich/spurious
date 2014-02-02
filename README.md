spurious.js
===========

Spurious is a JavaScript library that [Express](https://github.com/visionmedia/express) uses  to create mock web services quickly and easily.  Spurious can also generate *quality* fake data for your web services.

This library was born out of the frustration that comes with developing the front-end of an application and the back-end synchronously.  APIs that are not implemented, bugs, and other things can seriously hamper your front-end development.  As long as a resource definition is agreed upon, Spurious can generate a RESTful "mock" API that the front-end can consume.

## Quick Start

The easiest way to get running quickly with Spurious is to clone the 
[Spurious sample app](https://github.com/JJJaquette/spurious-sample-app) on your local machine.

```
git clone https://github.com/JJJaquette/spurious-sample-app
```
Next, change into the sample app's directory, install the necessary modules, and start the server.
```
cd spurious-sample-app
npm install
npm start
```
The sample app comes with a simple Employee resource that generates 25 records.  The Employee resource is completely arbitrary.  You can remove the Employee resource, add to it, create more resources, etc.  We will get to the configuration later.  For now, you are just going to play with the Employee resource to get an idea of how Spurious works.

Depending on how a resource is configure, it respond to four HTTP methods: ```GET```, ```POST```, ```PUT```, and ```DELETE```.

Let's make some requests to the Employee resource.  I will use (cURL)[http://curl.haxx.se/] to execute the requests, but feel free to use any tool that allows you to make HTTP requests.

#### GET

There are two variations of ```GET``` that are recognized.  A list of resources can be returned as well as an individual resource.

To retrieve a list of Employees, execute the follow cURL command (or the equivalent in your tool).
```
curl -i http://localhost:3000/Employee
```
A list of the 25 generated Employees is returned with a ```200 OK``` HTTP status.
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2070
ETag: "-1493604622"
Date: Sat, 01 Feb 2014 22:35:45 GMT
Connection: keep-alive

[
  {
    "EmployeeId": 1,
    "FirstName": "Leopoldo",
    "LastName": "Howe"
  },
  {
    "EmployeeId": 2,
    "FirstName": "Michelle",
    "LastName": "Mosciski"
  },
  {
    "EmployeeId": 3,
    "FirstName": "Alison",
    "LastName": "Moore"
  },
        ...
  {
    "EmployeeId": 25,
    "FirstName": "Ona",
    "LastName": "Prohaska"
  }
]
```
To retrieve a list, just make a request for the resource without supplying an id.  Supplying an id will return a single resource.

```
curl -i http://localhost:3000/Employee/25
```

The single Employee resource that was requested is returned with a ```200 OK``` HTTP status.

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 70
ETag: "-46630880"
Date: Sat, 01 Feb 2014 22:40:34 GMT
Connection: keep-alive

{
  "EmployeeId": 25,
  "FirstName": "Ona",
  "LastName": "Prohaska"
}
```

#### POST

Adding a resource is as simple as issuing a ```POST```.  

```
curl -i X POST -H "Content-Type: application/json" -d '{"EmployeeId":0, "FirstName":"Jean-Jacques", "LastName":"Jaquette"}' http://localhost:3000/Employee
```

The server responds with a ```201 Created``` status, and returns the new Employee resource with the updated identified.  Spurious handles generating simple autoincremented identifiers.

```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 79
Date: Sat, 01 Feb 2014 22:43:16 GMT
Connection: keep-alive

{
  "EmployeeId": 27,
  "FirstName": "Jean-Jacques",
  "LastName": "Jaquette"
}
```

