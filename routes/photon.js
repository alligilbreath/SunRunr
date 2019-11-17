var express = require('express');
var router = express.Router();
var Device = require("../models/device");
var HwData = require("../models/deviceData");

/* POST: Register new device. */
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
											console.log("Data does not warrent an alert");
											responseJson.status = "NoAlert";
											res.status(201).send(JSON.stringify(responseJson))
										//}
									}
								});
							}
							catch(er)
							{
								res.status(201).send(JSON.stringify(responseJson));
								responseJson.status = "Not enough data, recorded though";
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
