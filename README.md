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

Let's make some requests to the Employee resource.  I will use [cURL](http://curl.haxx.se/) to execute the requests, but feel free to use any tool that allows you to make HTTP requests.

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

#### PUT

Issuing a ```PUT``` to the server on the resource will update a resource.  You must supply an identifier, so the application knows which resource to update.

```
curl -i -X PUT -H "Content-Type: application/json" -d '{"EmployeeId":25, "FirstName":"Baruch", "LastName":"Spinoza"}' http://localhost:3000/Employee/25
```
The updated resource is returned with a ```200 OK``` response.

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 72
Date: Sat, 01 Feb 2014 22:51:34 GMT
Connection: keep-alive

{
  "EmployeeId": 25,
  "FirstName": "Baruch",
  "LastName": "Spinoza"
}
```

You can verify that the resource was updated by issuing a ```GET ``` on the resource with the appropriate identifier as shown above.

#### DELETE

Deleting a resource is easy, and I'm sure you can guess what you need to do.  Making a ```DELETE``` request to the server will remove the resource.

```
curl -i -X DELETE http://localhost:3000/Employee/26
```
The resource is removed, and the server responds with an empty body and a ```204 No Content``` status.

```
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Sat, 01 Feb 2014 22:55:14 GMT
Connection: keep-alive
```

## Configuration

The heart of Spurious is the ```spurious.yaml``` file, and the sample app uses the following configuration.

```
resources:
  - 
    name: Employee
    methods:
      - get
      - post
      - put
      - delete
    generate: 25
    properties: 
      -  
        name: EmployeeId
        type: int
        pk: true
      -  
        name: FirstName
        faker: 
          category: Name
          type: firstName
      - 
        name: LastName
        faker:
          category: Name
          type: lastName
```

The configuration file is simple.  There is a list of ```resources```.  You can define as many resources as you need. 

Each resource has a ```name```, available HTTP ```methods```, and a list of ```properties```.  Below, I will get into which properties are required and details about what each property accomplishes.

#### "name"

There are two names.  The resource name and the property name.  Both of these names are required.  If a resource is defined, it must have a name.  If a property is defined, it also must have a name.

The resource name is used in the URL when making requests for a resource.  In the above file, you will notice that the resource's ```name``` is ```Employee``` which directly corresponds to the "Employee" in the URL (e.g. ```http://localhost:3000/Employee```).

The property name is the name that is used in the JSON objects that are sent between the client and the server.  For example, in the above example, the ```Employee``` resource has three properties.  Each property has a ```name```.  Notice that the JSON object that we retrieve when making the request to ```http://localhost:3000/Employee/1``` has three properies: ```EmployeeId```, ```FirstName```, and ```LastName```.  These names, as you can guess, directly correspond to the property names defined in the configuration.

#### "methods"

```methods``` is a list of HTTP methods that the server will allow for a resource.  The available options are ```get```, ```post```, ```put```, and ```delete```.  If you try to make a request for a resource that does not allow that particular method, the server will return a ```405 Method Not Allowed``` status.

#### "properties"

Properties were discussed above in the ```"name"``` section.  The properties array is required to have at least one element.  You can have as many properties as you like.

#### "generate"

If ```generate``` exists with a valid integer value, Spurious will generate that number of records.  If the ```generate``` property does not exist, no records will be generated.  You can still perform all actions on the resource.

#### "faker"

If ```generate``` exists, one or more properties must have a ```faker``` property.  The ```faker``` property has two required properties, ```category``` and ```type```.  The two required properties correspond directly to the marvelous [Faker.js](https://github.com/marak/Faker.js/) API.  Take a look at the documentation for Faker.js to see what generated data is available.  

```category``` corresponds to the top-level of the API.  For instance, ```Name```, ```Address```, ```PhoneNumber```, etc.  The ```category``` value **is** case-sensitive.

The ```type``` of ```faker``` directly corresponds to the bottom-level of the Faker.js API.  For example, ```findName```, ```phoneNumber```, ```email```, etc.  The ```type``` is also case sensitive.  

Take a look at the Faker.js API.  It is really, really cool.

#### "pk"

The ```pk``` property of an element of ```properties``` defines the resource's primary key.  One, and only one, primary key can be defined per resource.  If multiple primary keys are defined in a single resource, Spurious will spit out an error message and not load anything.  

The primary key is auto-generated.  The value of the key is always an integer and always begins at 1.  This is the value used when making requests on a resource that require an id (e.g.. ```http://localhost:3000/Employee/1```.
