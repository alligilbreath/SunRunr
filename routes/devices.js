let express = require('express');
let router = express.Router();
let Device = require("../models/device");
let deviceData = require("../models/deviceData");
let fs = require('fs');
let jwt = require("jwt-simple");

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
router.get('/sensorData', function(req, res, next){
	deviceData.find({"deviceId": req.query.deviceId}).exec(function(err,data){
		if(err){
			res.send("Error has occured");
		}
		else{
			res.json(data);
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

  // See if device is already registered
  Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
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
        apikey: deviceApikey
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

	};
	// Ensure the POST data includes required properties
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
		res.status(201).send(JSON.stringify(responseJson));
	}
	else if( !req.body.hasOwnProperty("apikey") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing apikey parameter.";
		res.status(201).send(JSON.stringify(responseJson));
	}
	else if( !req.body.hasOwnProperty("longitude") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing longitude parameter.";
		res.status(201).send(JSON.stringify(responseJson));
	}
	else if( !req.body.hasOwnProperty("latitude") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing latitude parameter.";
		res.status(201).send(JSON.stringify(responseJson));
	}
  else if( !req.body.hasOwnProperty("speed") ) {
    responseJson.status = "ERROR";
    responseJson.message = "Request missing speed parameter.";
    res.status(201).send(JSON.stringify(responseJson));
  }
	else if( !req.body.hasOwnProperty("uv") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing latitude parameter.";
		res.status(201).send(JSON.stringify(responseJson));
	}

	else if( !req.body.hasOwnProperty("time") ) {
		responseJson.status = "ERROR";
		responseJson.message = "Request missing time parameter.";
		res.status(201).send(JSON.stringify(responseJson));
	}
	else {
		// Find the device by deviceId and API
			try{
				Device.find({"deviceId": req.body.deviceId, "apikey": req.body.apikey}).exec(function(err1, data)
				{
					//Device is not in database or there is an error
					if (err1) {
						res.status(401).json({ error: "Database findOne error" });
					}
				});
			}
			catch(er)
			{
				responseJson.status = "Server database error";
				res.status(401).send(JSON.stringify(responseJson));
			}
			//Found deviceId and API key
					var uvData = new deviceData({
						deviceId: req.body.deviceId,
						longitude: req.body.longitude,
						latitude: req.body.latitude,
            speed: req.body.speed,
						uvIndex: req.body.uv,
						time: req.body.time,
					});
					responseJson.message = "UV data recorded";
          //Save the Data
						uvData.save(function(err) {
						if (err) {
							responseJson.status = "ERROR";
							responseJson.message = "Error saving data in db." + err;
							res.status(201).send(JSON.stringify(responseJson));
						}
						else {
							try{
                //See if with new data warrants an alert
								deviceData.find({"deviceId": req.body.deviceId}).sort({$natural:-1}).limit(3).exec(function(err1, data)
								{
									if (err1) {
										res.status(201).json({ error: "Database findOne error" });
									}
									else
									{
                    //TODO: Account for threshold
										// if(data[0].uvIndex >50 && data[1].uvIndex >50 && data[2].uvIndex >50)
										// {
										// 	responseJson.status = "Alert";
										// 	res.status(201).send(JSON.stringify(responseJson))
										// }
										//else{
											//console.log("Data does not warrent an alert");
											responseJson.status = "NoAlert";
											res.status(201).send(data)
										//}
									}
								});
							}
							catch(er)
							{
                responseJson.status = "Not enough data, recorded though";
								res.status(201).send(JSON.stringify(responseJson));

							}
						}
					});
			}
});

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
