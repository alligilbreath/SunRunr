let express = require('express');
let router = express.Router();
let User = require("../models/users");
let Device = require("../models/device");
let deviceData = require("../models/deviceData");
let fs = require('fs');
let bcrypt = require("bcryptjs");
let jwt = require("jwt-simple");

/* Authenticate user */
var secret = fs.readFileSync(__dirname + '/jwtkey').toString();

//Sign in a user
router.post('/signin', function(req, res, next) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
       res.status(401).json({success : false, message : "Can't connect to DB."});
    }
    else if(!user) {
       res.status(401).json({success : false, message : "Email or password invalid."});
    }
    else {
      bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
         if (err) {
           res.status(401).json({success : false, message : "Error authenticating. Contact support."});
         }
         else if(valid) {
           user.lastAccess = Date.now();
            var authToken = jwt.encode({email: req.body.email}, secret);
            //Redirects to account.html (add "redirect:"/account.html")
            res.status(201).json({success:true, authToken: authToken});
         }
         else {
            res.status(401).json({success : false, message : "Email or password invalid."});
         }

      });
    }
  });
});

/* Register a new user */
router.post('/register', function(req, res, next) {

   bcrypt.hash(req.body.password, 10, function(err, hash) {
      if (err) {
        console.log("Hash sucks");
         res.status(400).json({success : false, message : err.errmsg});
      }
      else {
        console.log(req.body.email);
        var newUser = new User ({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            lastAccess: Date.now(),
            userDevices: [],
            threshold: 1000
        });

        newUser.save(function(err, user) {
          if (err) {
            console.log("User already exists with that token");
            console.log(err);
             res.status(400).json({success : false, message : "User already exists with that email."});
          }
          else {
            console.log("User created");
             res.status(201).json({success : true, message : user.fullName + "has been created"});
          }
        });
      }
   });
});

//Get account information including user information and devices
router.get("/account" , function(req, res) {
   // Check for authentication token in x-auth header
   if (!req.headers["x-auth"]) {
      return res.status(401).json({success: false, message: "No authentication token"});
   }

   var authToken = req.headers["x-auth"];

   try {
      var decodedToken = jwt.decode(authToken, secret);
      var userStatus = {
        success : "",
        email : "",
        fullName : "",
        lastAccess : Date.now(),
        devices : []
      };

      User.findOne({email: decodedToken.email}, function(err, user) {
         if(err) {
            return res.status(400).json({success: false, message: "User does not exist."});
         }
         else {
            userStatus.success = true;
            userStatus.email = user.email;
            userStatus.fullName = user.fullName;
            userStatus.lastAccess = Date.now();

            // Find devices based on decoded token
		      Device.find({ userEmail : decodedToken.email}, function(err, devices) {
			      if (!err) {
			         // Construct device list
			         let deviceList = [];
			         for (device of devices) {
				         deviceList.push({
				               deviceId: device.deviceId,
				               apikey: device.apikey,
				         });
			         }
			         userStatus.devices = deviceList;
			      }

               return res.status(200).json(userStatus);
		      });
         }
      });
   }
   catch (ex) {
      return res.status(401).json({success: false, message: "Invalid authentication token."});
   }
});

router.post("/setThreshold", function(req, res){
  if (!req.body.hasOwnProperty("email")) {
     return res.status(400).json({success: false, message: "Missing email in request"});
  }
  else{
    try {
      Users.findOne({"email": req.body.email}, function (err, user){
        if(!err){
          user.threshold = req.body.threshold;
          let devices = users.userDevices;
          for (var i = 0; i < devices.length; i++){
            devices[i].threshold = req.body.threshold;
          }
          return res.status(201).json({success: true, message: "Threshold updated."});
        }
        else{
          return res.status(400).json({success: false, message: "User does not exist."})
        }
      });

    }
    catch{
      return res.status(400).json({success: false, message: "Couldn't change threshold."});
    }
  }

});



module.exports = router;
