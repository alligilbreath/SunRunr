var db = require("../db");

//Need deviceId, GPS info, and UV info
var deviceDataSchema = new db.Schema({
    deviceId: String,
    longitude: String,
    latitude: String,
    speed: [Number],
    uvIndex: [Number],
    //Including time just in case
    startTime: { type: Date, default: Date.now },
    endTime: {type: Date, default: Date.now},
    duration: Number,
    activityType: String,
    temperature: String,
    humidity: String
});
var deviceData = db.model("deviceData", deviceDataSchema);
module.exports = deviceData;
