spurious.js
===========

Spurious is a JavaScript library that (Express)[https://github.com/visionmedia/express] uses  to create mock web services quickly and easily.  Spurious can also generate **quality** fake data for your web services.

This library was born out of the frustration that comes with developing the front-end of an application and the back-end synchronously.  APIs that are not implemented, bugs, and other things can seriously hamper your front-end development.  As long as a resource definition is agreed upon, Spurious can generate a RESTful "mock" API that the front-end can consume.

## Quick Start

The easiest way to get running quickly with Spurious is to clone the (Spurious sample app)[https://github.com/JJJaquette/spurious-sample-app] on your local machine.

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
