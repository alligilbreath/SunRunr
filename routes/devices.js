let express = require('express');
let router = express.Router();
let Device = require("../models/device");
let deviceData = require("../models/deviceData");
let fs = require('fs');
let jwt = require("jwt-simple");
let request = require("request");

/* Authenticate user */
var secret = fs.readFileSync(__dirname + '/jwtkey').toString();


// Function to generate a random apikey consisting of 32 characters
function getNewApikey() {
  let newApikey = "";
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 32; i++) {
    newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return newApikey;
}

//Updates the threshold
router.post("/setThreshold", function(req, res){
  if (!req.body.hasOwnProperty("deviceId")) {
     return res.status(401).json({success: false, message: "Missing deviceId in request"});
  }
  else{
    try {
      Device.findOne({"deviceId": req.body.deviceId}, function (err, device){
        if(!err){
          device.threshold = req.body.threshold;
          return res.status(200).json(userStatus);
        }
        else{
          return res.status(400).json({success: false, message: "Couldn't find device."})
        }
      });

    }
    catch{
      return res.status(401).json({success: false, message: "Couldn't change threshold."});
    }
  }

});

router.get('/summary'), function(req, res, next){
  let dataPoints = deviceData.find({"deviceId" : req.body.deviceId});
  for (var i = 0; i < dataPoints.length; i++){

  }
}

router.get('/weather', function(req, res, next){
  let lastData = deviceData.find({}).sort({_id:-1}).limit(1);
  lastLat = lastData.latitude;
  lastLong = lastData.longitude;
  request({
    method: "GET",
    uri: "https://samples.openweathermap.org/data/2.5/forecast",
    qs: {
      lat: lastLat,
      log: lastLong,
      appid: "3471745d22814f7d2209675f54c3ec14"
    }
  }, function(err, response, body){
    var apiRes = JSON.parse(body);
    var list = apiRes.list;
    var locals = {

    }
    res.status(400);
  });

});


// GET request return one or "all" devices registered and last time of contact.
router.get('/status/:devid', function(req, res, next) {
  let deviceId = req.params.devid;
  let responseJson = { devices: [] };

  if (deviceId == "all") {
    let query = {};
  }
  else {
    let query = {
      "deviceId" : deviceId
    };
  }

  Device.find(query, function(err, allDevices) {
    if (err) {
      let errorMsg = {"message" : err};
      res.status(400).json(errorMsg);
    }
    else {
      for(let doc of allDevices) {
        responseJson.devices.push({ "deviceId": doc.deviceId,  "lastContact" : doc.lastContact});
      }
    }
    res.status(200).json(responseJson);
  });
});

//Get user's devices
router.get('/myDevices', function(req, res, next){
	if(!req.headers["x-auth"]) {
		return res.status(401).json({ error: "Missing X-Auth header"});
	}

	var token = req.headers["x-auth"];

	try {
		var decoded = jwt.decode(token, secret);
		Device.find({ userEmail: decoded.email }).exec(function(err, data) {
			if(err) {
				res.status(400).send("Error occurred while fetching devices");
			}
			else {
				res.status(200).json(data);
			}
		});
  }
  catch (er) {
		res.status(400).send(er);
	}
});

//Get all sensor data for deviceId query
router.post('/sensorData', function(req, res, next){
  console.log("in sensor data");
	deviceData.find({"deviceId": req.body.deviceId}).exec(function(err,data){
		if(err){
      console.log("/sensor data error");
      //wasn't returning a status
			res.status(400).send("Error has occured");
		}
		else{
    //  console.log("/sensor data sent back");
      //console.log(data);
			res.status(201).send(JSON.stringify(data));
		}
	});
});

router.post('/register', function(req, res, next) {
  let responseJson = {
    registered: false,
    message : "",
    apikey : "none",
    deviceId : "none"
  };
  let deviceExists = false;

  // Ensure the request includes the deviceId parameter
  if( !req.body.hasOwnProperty("deviceId")) {
    responseJson.message = "Missing deviceId.";
    return res.status(400).json(responseJson);
  }

  let email = "";

  // If authToken provided, use email in authToken
  if (req.headers["x-auth"]) {
    try {
      let decodedToken = jwt.decode(req.headers["x-auth"], secret);
      email = decodedToken.email;
    }
    catch (ex) {
      responseJson.message = "Invalid authorization token.";
      return res.status(400).json(responseJson);
    }
  }
  else {
    // Ensure the request includes the email parameter
    if( !req.body.hasOwnProperty("email")) {
      responseJson.message = "Invalid authorization token or missing email address.";
      return res.status(400).json(responseJson);
    }
    email = req.body.email;
  }
  //Get threshold from user
  let user = User.findOne({"email": email});
  let userThreshold = user.threshold;
  // See if device is already registered
  Device.findOne({"deviceId": req.body.deviceId }, function(err, device) {
    if (device !== null) {
      responseJson.message = "Device ID " + req.body.deviceId + " already registered.";
      return res.status(400).json(responseJson);
    }
    else {
      // Get a new apikey
	   deviceApikey = getNewApikey();

	    // Create a new device with specified id, user email, and randomly generated apikey.
      let newDevice = new Device({
        deviceId: req.body.deviceId,
        userEmail: email,
        apikey: deviceApikey,
        threshold: userThreshold
      });

      // //See if a user has the email
      // //Then push the deviceId to the User's device list
      User.findOne({email: req.body.email}, function(err, user){
        if(user !== null){
          conosle.log("Saved user device");
          user.userDevices.push(req.body.deviceId);
        }
        else{
          responseJson.message = "User does not exist..."
          return res.status(400).json(responseJson);
        }
      });

      // Save device. If successful, return success. If not, return error message.
      newDevice.save(function(err, newDevice) {
        if (err) {
          responseJson.message = err;
          // This following is equivalent to: res.status(400).send(JSON.stringify(responseJson));
          return res.status(400).json(responseJson);
        }
        else {
          responseJson.registered = true;
          responseJson.apikey = deviceApikey;
          responseJson.deviceId = req.body.deviceId;
          responseJson.message = "Device ID " + req.body.deviceId + " was registered.";
          return res.status(201).json(responseJson);
        }
      });
    }
  });
});

//Not sure if this is needed for our project
router.post('/ping', function(req, res, next) {
    let responseJson = {
        success: false,
        message : "",
    };
    let deviceExists = false;

    // Ensure the request includes the deviceId parameter
    if( !req.body.hasOwnProperty("deviceId")) {
        responseJson.message = "Missing deviceId.";
        return res.status(400).json(responseJson);
    }

    // If authToken provided, use email in authToken
    try {
        let decodedToken = jwt.decode(req.headers["x-auth"], secret);
    }
    catch (ex) {
        responseJson.message = "Invalid authorization token.";
        return res.status(400).json(responseJson);
    }

    request({
       method: "POST",
       uri: "https://api.particle.io/v1/devices/" + req.body.deviceId + "/pingDevice",
       form: {
	       access_token : particleAccessToken,
	       args: "" + (Math.floor(Math.random() * 11) + 1)
        }
    });

    responseJson.success = true;
    responseJson.message = "Device ID " + req.body.deviceId + " pinged.";
    return res.status(200).json(responseJson);
});

//Save information to server
//Basically a copy-paste of potholes.js from ECE Server 19
router.post('/sunRun', function(req, res) {
	var responseJson = {
		status : "",
		message : "",
    threshold: 1000

	};
	// Ensure the POST data includes required properties
  console.log(req.body);
	if(!req)
	{
		console.log("Missing JSON entirely");
		responseJson.status = "ERROR";
		responseJson.message = "Request missing all parameters.";
		res.status(201).send(JSON.stringify(responseJson));
	}
	else if(!req.body)
	{
		console.log("Missing JSON body");
		responseJson.status = "ERROR";
		responseJson.message = "Request missing body.";
		res.status(201).send(JSON.stringify(responseJson));
	}
	else if( !req.body.hasOwnProperty("deviceId") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing deviceId parameter.";
    console.log("no deviceid");
		res.status(201).send(JSON.stringify(responseJson));
	}
	else if( !req.body.hasOwnProperty("apikey") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing apikey parameter.";
    console.log("No api key");
		res.status(201).send(JSON.stringify(responseJson));
	}
	else if( !req.body.hasOwnProperty("longitude") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing longitude parameter.";
    console.log("No long");
		res.status(201).send(JSON.stringify(responseJson));
	}
	else if( !req.body.hasOwnProperty("latitude") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing latitude parameter.";
    console.log("No lat");
		res.status(201).send(JSON.stringify(responseJson));
	}
  else if( !req.body.hasOwnProperty("speed") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing speed parameter.";
    console.log("no speed");
    res.status(201).send(JSON.stringify(responseJson));
  }
	else if( !req.body.hasOwnProperty("uv") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing latitude parameter.";
    console.log("No uv");
		res.status(201).send(JSON.stringify(responseJson));
	}

	else if( !req.body.hasOwnProperty("time") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing time parameter.";
    console.log("no time");
		res.status(201).send(JSON.stringify(responseJson));
	}
  else if(!req.body.hasOwnProperty("status")){
    responseJson.status = "ERROR";
    responseJson.message = "Request missing status parameter.";
    console.log("no status");
    res.status(201).send(JSON.stringify(responseJson));
  }
	else {
		// Find the device by deviceId and API
			try{
				let deviceUsed = Device.find({"deviceId": req.body.deviceId, "apikey": req.body.apikey});
        deviceUsed.exec(function(err1, data)
				{
					//Device is not in database or there is an error
					if (err1) {
            console.log("Database find one error");
						res.status(401).json({ error: "Database findOne error" });
					}
				});
			}
			catch(er)
			{
				responseJson.status = "Server database error";
        console.log("server database error");
				res.status(401).send(JSON.stringify(responseJson));
			}
			//Found deviceId and API key
      //If starting activity then create the deviceData
      if(req.body.status == "start"){
        var uvData = new deviceData({
          deviceId: req.body.deviceId,
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          speed: [],
          uvIndex: [],
          startTime: Date.now(),
          endTime: Date.now(),
          duration: 0,
          activityType: "nothing yet",
          temperature: 0,
          humidity: 0
        });
        uvData.speed.push(req.body.speed);
        uvData.uvIndex.push(req.body.uv);
        responseJson.message = "UV data recorded";
        //Save the Data
          uvData.save(function(err) {
          if (err) {
            responseJson.status = "ERROR";
            console.log("START: Error saving " + err);
            responseJson.message = "Error saving data in db. " + err;
            res.status(201).send(JSON.stringify(responseJson));
            return;
          }
          else {
            // console.log("yoohoo");
            // responseJson.status = "NoAlert";
            // //res.status(201).send(JSON.stringify(uvData))
            try{
              //See if with new data warrants an alert
              deviceData.findOne({"deviceId": req.body.deviceId}).limit(1).exec(function(err1, data)
              {
                if (err1) {
                  console.log("START: Database find one erorr");
                  res.status(201).json({ error: "Database findOne error" });
                  return;
                }
                else
                {
                  //TODO: Account for threshold
                  let deviceUsed = Device.find({"deviceId": req.body.deviceId, "apikey": req.body.apikey});
                  if(data.uvIndex[0] > deviceUsed.threshold)
                  {
                    responseJson.status = "Alert";
                    console.log("START: Alert for threshold");
                    responseJson.message = "Threshold is " + deviceUsed.threshold;
                    responseJson.data = deviceUsed.threshold;
                    res.status(201).send(JSON.stringify(responseJson));
                    return;
                  }
                  else{
                    //console.log("Data does not warrent an alert");
                  //  console.log("yoohoo");
                    responseJson.status = "NoAlert";
                    console.log("START: No alert for threshold");
                    responseJson.message = "Threshold is " + deviceUsed.threshold;
                    responseJson.data = deviceUsed.threshold;
                    res.status(200).send(JSON.stringify(responseJson));
                    return;
                  //}
                }
              }});
            }
            catch(err)
            {
              responseJson.status = "Not enough data, recorded though";
              console.log("START: Not enough data, recorded though " + err);
              responseJson.threshold = deviceUsed.threshold;
              res.status(201).send(JSON.stringify(responseJson));
              return;

            }
          }
        });
        }
      //if we're stopping the activity
      else if (req.body.status == "stop") {
        deviceData.findOne({"deviceId": req.body.deviceId}).exec(function(err1, data){
          if (err1){
            responseJson.status = "ERROR";
            console.log("STOP: Error finding devicedata");
            responseJson.message = "Error finding activity in db. " + err;
            res.status(201).send(JSON.stringify(responseJson));
          }
          else if(!data){
            responseJson.status = "ERROR";
            console.log("STOP: No data");
            responseJson.message = "No data." + err;
            res.status(401).send(JSON.stringify(responseJson));
          }
          else{
            data.longitude = req.body.longitude;
            data.latitude = req.body.latitude;
            data.endTime = Date.now();
            data.duration = Math.abs(data.endTime - data.startTime);
            data.speed.push(req.body.speed);
            data.uvIndex.push(req.body.uv);
            let total = 0;
            for(var i = 0; i < data.speed.length; i++){
              total += data.speed[i];
            }
            var speedAvg = total / data.speed.length;
            //Determine an activity based on average speed
            if(speedAvg < 5){
              data.activityType = "walking";
            }
            else if(speedAvg < 10){
              data.activityType = "running";
            }
            else{
              data.activityType = "biking";
            }
            var lastLong = data.longitude;
            var lastLat = data.latitude;
            //Get humidity and temperature for the activity
            request({
              method: "GET",
              uri: "https://samples.openweathermap.org/data/2.5/weather",
              qs: {
                lat: lastLat,
                log: lastLong,
                appid: "3471745d22814f7d2209675f54c3ec14"
              }
            }, function(err, response, body){
              var apiRes = JSON.parse(body);
              data.humidity = apiRes.main.humidity;
              data.temperature = apiRes.main.temp;
            });
            data.save(function(err){
              if(err){
                responseJson.status = "ERROR";
                responseJson.message = "Error updating data in DB" + err;
                console.log("STOP: error updating datbase");
                res.status(201).send(JSON.stringify(responseJson));
                return;
              }
              else{
                try{
                  //See if with new data warrants an alert
                  deviceData.findOne({"deviceId": req.body.deviceId}).limit(1).exec(function(err1, data)
                  {
                    if (err1) {
                      console.log("STOP: database findone error")
                      res.status(201).json({ error: "Database findOne error" });
                      return;
                    }
                    else
                    {
                      let deviceUsed = Device.findOne({"deviceId": req.body.deviceId});
                      if(data.uvIndex[data.uvIndex.length] > deviceUsed.threshold)
                      {
                        responseJson.status = "Alert";
                        responseJson.message = "Threshold is " + deviceUsed.threshold;
                        console.log("STOP: threshold exceeded");
                        responseJson.data = deviceUsed.threshold;
                        res.status(201).send(JSON.stringify(responseJson));
                        return;
                      }
                      else{
                        //console.log("Data does not warrent an alert");
                      //  console.log("yoohoo");
                        responseJson.status = "NoAlert";
                        responseJson.message = "Threshold is " + deviceUsed.threshold;
                        console.log("STOP: No alert for threshold");
                        responseJson.data = deviceUsed.threshold;
                        res.status(200).send(JSON.stringify(responseJson));
                        return;
                      //}
                    }
                  }});
                }
                catch(err1)
                {
                  responseJson.status = "Not enough data, recorded though";
                  console.log("STOP: not enough data, recorded though " + err);
                  responseJson.threshold = deviceUsed.threshold;
                  res.status(201).send(JSON.stringify(responseJson));
                  return;

                }
              }
            }); //end of saving data
          } //end of else
          });
      } //end of stop status
      //If we are updating the speed and uvindex values
      else if (req.body.status == "activity"){
          deviceData.findOne({"deviceId": req.body.deviceId}).exec(function(err1, data){
            if(err1){
              responseJson.status = "ERROR";
              console.log("Activity: erorr finding devicedata" + err1);
              responseJson.message = "Error finding activity in db. " + err1;
              res.status(201).send(JSON.stringify(responseJson));
              return;
            }
            else{
              if(!data){
                responseJson.status = "ERROR";
                console.log("Activity: no data");
                responseJson.message = "No data." + err1;
                res.status(201).send(JSON.stringify(responseJson));
                return;
              }
              else{
                data.speed.push(req.body.speed);
                data.uvIndex.push(req.body.uv);
                data.save(function(err){
                  if(err){
                    responseJson.status = "ERROR";
                    console.log("Activity: erorr updating");
                    responseJson.message = "Error updating data in DB" + err;
                    res.status(201).send(JSON.stringify(responseJson));
                    return;
                  }
                  else{
                    try{
                      //See if with new data warrants an alert
                      deviceData.findOne({"deviceId": req.body.deviceId}).limit(1).exec(function(err1, data)
                      {
                        if (err1) {
                          console.log("Database findOne error");
                          res.status(201).json({ error: "Database findOne error" });
                          return;
                        }
                        else
                        {
                          let deviceUsed = Device.findOne({"deviceId": req.body.deviceId});
                          if(data.uvIndex[data.uvIndex.length] > deviceUsed.threshold)
                          {
                            responseJson.status = "Alert";
                            console.log("Activity: Alert for threshold");
                            responseJson.message = "Threshold is " + deviceUsed.threshold;
                            responseJson.data = threshold;
                            res.status(201).send(JSON.stringify(responseJson));
                            return;
                          }
                          else{
                            //console.log("Data does not warrent an alert");
                          //  console.log("yoohoo");
                            responseJson.status = "NoAlert";
                            console.log("Activity: No alert for threshold");
                            responseJson.message = "Threshold is " + deviceUsed.threshold;
                            responseJson.data = deviceUsed.threshold;
                            res.status(200).send(JSON.stringify(responseJson));
                            return;
                          //}
                        }
                      }});
                    }
                    catch(er)
                    {
                      responseJson.status = "Not enough data, recorded though";
                      console.log("Activity: No Alert for threshold");
                      responseJson.threshold = "Threshold is " + deviceUsed.threshold;
                      responseJson.data = deviceUsed.threshold;
                      res.status(201).send(JSON.stringify(responseJson));
                      return;

                    }
                  }
                }); //end of saving data
              } //end of else for saving
            }//end of no-error else
          }); // end of find and execute
      } //end of activity status
      else if(status == "paused"){
        responseJson.status = "Paused";
        responseJson.message = "In paused state, so all is good";
        console.log("Paused");
        res.status(200).send(JSON.stringify(responseJson));
        return;
      }
      else{
				responseJson.status = "ERROR";
        console.log("ERROR: Other");
				responseJson.message = "Device ID " + req.body.deviceId + " not registered.";
				res.status(201).send(JSON.stringify(responseJson));
        return;
      }


}});

//Delete a device and its deviceData
router.delete('/deleteDevice', function(req, res){
	console.log("deleting device");

	if(!req.headers["x-auth"]) {
		return res.status(401).json({ error: "Missing X-Auth header"});
	}

	var token = req.headers["x-auth"];
	try {
		var decoded = jwt.decode(token, secret);

		Device.findOne({ deviceId: req.body.deviceId }, function(err, data) {
			if(err) {
				return res.status(400).json({ error: "Error finding device to remove" });
			}
			else if(!data) {
				return res.status(400).json({ error: "Could not find device in database" });
			}
			else if(data.userEmail == decoded.email) {
				Device.remove({ deviceId: req.body.deviceId }, function(err, data) {
					if(err) {
						return res.status(400).json({ error: "Error removing deviceId" });
					}
				});
				User.update({ email: decoded.email }, { $pull: {userDevices: req.body.deviceId }}, function(err, user) {
					if(err) {
						return res.status(400).json({ error: "Error removing deviceId from user's deviceId list"});
					}
				});

				deviceData.remove({ deviceId: req.body.deviceId }, function(err, data) {
					if(err) {
						return res.status(400).json({ error: "Error removing data from deviceData" });
					}
					else {
						return res.status(200).json({ message: "Succesfully deleted device"});
					}
				});
			}
			else {
				return res.status(401).json({ error: "Device does not belong to user"});
			}
		});

	}
  catch (ex)
  {
		return res.status(400).json({ error: "Error decoding token in deleteDevice" });
	}
});

module.exports = router;
