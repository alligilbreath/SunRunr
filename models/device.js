var db = require("../db");

var deviceSchema = new db.Schema({
    apikey:       String,
    deviceId:     String,
    userEmail:    String,
    //Including lastContact just in case
    lastContact:  { type: Date, default: Date.now },
    threshold: {type: Number, default: 10000},
    data: [String]
});

var Device = db.model("Device", deviceSchema);

module.exports = Device;
