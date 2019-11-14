var express = require('express');
var router = express.Router();
var Participation = require("../models/participation.js");
var ip = require('ip');

router.get("/", function(req, res) {
    var query = {};

    if( req.query.email ) {
        query = {email : req.query.email}
    } 
    else {
        var errormsg = {"error" : "email address required"};
        res.status(400).send(JSON.stringify(errormsg));
        return;
    }
    
    Participation.find(query,"email timestamp ipaddress -_id", function(err, participations) {
        var count = participations.length;
        if (err) {
            res.status(400).send(err);
        }  
	else{
            if (count == 0) {
                var errormsg = {"error" : "email does not exist"};
                res.status(400).send(JSON.stringify(errormsg));
            }
            else {
                res.status(200).json(participations[0]);     
            }
        }
    });
});

// Add a new participation to the database                                                          
router.post("/", function(req, res) {
    req.body.ipaddress = ip.address();
    
    var participationEntry = new Participation(req.body);
    participationEntry.save(function(err, partdb) {
        if (err) {
            res.status(400).send(err);
        } 
	else {
            res.status(201).json(participationEntry);
        }
    });
});

module.exports = router;

