var db = require("../db");

//Need deviceId, GPS info, and UV info
var deviceDataSchema = new db.Schema({
    deviceId: String,
    longitude: String,
    latitude: String,
    uvIndex: String,
    //Including time just in case
    time: String
});
var deviceData = db.model("deviceData", deviceDataSchema);
module.exports = deviceData;
