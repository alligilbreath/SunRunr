var db = require("../db");

//Need deviceId, GPS info, and UV info
var deviceDataSchema = new db.Schema({
    deviceId: String,
    longitude: String,
    latitude: String,
    speed: String,
    uvIndex: String,
    //Including time just in case
    time: String
    //TODO: Where should threshold be stored? Here or device or user?
    //TODO: Temperature, humidity, activity(?)
});
var deviceData = db.model("deviceData", deviceDataSchema);
module.exports = deviceData;
