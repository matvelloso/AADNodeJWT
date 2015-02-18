var express = require('express');
var aadJwt = require('../aadJwt');


//Main router which is exported from the module
var genericRouter = express.Router();

//The anonymous router doesn't do any security checks
var anonymousRouter = express.Router();

//The authorization Router ensures we have a valid Jwt
var authorizationRouter = express.Router();


genericRouter.route('/allopen')
.get(function (req, res) { 
    res.json({ message: "We don't check who you are here!." })
}, anonymousRouter);


genericRouter.use(function (req, res, next) {
    // inject auth logic here
    aadJwt.validateRequest(req, res,function (authorized) {

        if (authorized)
            next(); // make sure we go to the next routes and don't stop here
        else {
            var err = new Error('Unauthorized');
            err.status = 401;
            next(err);
        }
    
    });
}, authorizationRouter);

genericRouter.route('/secure')
.post(function (req, res) { //Create a document
    res.json({ message: "Your secure request worked." });
}, authorizationRouter)
.get(function (req, res) { //Get all documents
    res.json({ message: "Your secure request worked."})
}, authorizationRouter);

module.exports = genericRouter;
