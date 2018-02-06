const mongoose = require("mongoose");

var SensorSchema = new mongoose.Schema({
  name : { type: String, unique: true },
  lastMessage : String,
  mounted : { type: Boolean, default: true },
  previousMsgs : [String]
});
SensorSchema.methods.getPirTopic = function (){
  return this.name + "/pir";
}
SensorSchema.methods.getMagnetTopic = function (){
  return this.name + "/magnet";
}
SensorSchema.methods.getMainTopic = function (){
  return this.name + "/main";
}
var Sensor = mongoose.model('Sensor', SensorSchema);

module.exports = {
  Sensor: Sensor
}