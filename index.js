const EventEmitter = require('events');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sensor_db');

var db = mongoose.connection;

db.on('error', error => {
  console.log('db connection error: ', err);
})
db.once('open', () => {
  console.log('db connected.');
})
const Sensor = require("./models/sensor").Sensor;


var path = require('path');
const WebServer = require('./webserver');
var webserver = new WebServer();
webserver.app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, './views') });
})

webserver.app.get('/api/sensors', (req, res) => {
  console.log('Alguien hizo una petición para obtener los sensores');
  Sensor.find({}, (error, sensors) => {
    var sensorsMap = {};
    sensors.forEach( sensor => {
        sensorsMap[sensor._id] = sensor;
    });
    res.json(sensorsMap);
  })
});
webserver.app.post('/api/register', (req, res) => {
  let name = req.body.topicName.toString('utf8');
  var newSensor = new Sensor({
    name: name
  });
  newSensor.save( (err, data) => {
    if (err){
      console.log(err);
    } else {
      mqttClient.subscribeTo(newSensor.getPirTopic());
      mqttClient.subscribeTo(newSensor.getMagnetTopic());
      mqttClient.subscribeTo(newSensor.getMainTopic());
      console.log('Saved ', data);
    }
  });
});
webserver.app.post('/api/toggle_mount', (req, res) => {
  console.log("BIG ASS DEBUGGER: ", req.body.name);
  let name = req.body.name;
  let mounted = req.body.mount;
  if(mounted) {
    unmountSensors(name);
  } else{
    mountSensors(name);
  }
});

const MqttClient = require('./mqttclient');

let ipAddress = '192.168.43.100';

var io = require('socket.io').listen(webserver.server)

const TelegramBot = require('./telegrambot.js');
var ids = [];
var telegramParams = {
  token: '465245321:AAFmSBcoun3wW48BZI7MWF1xogPVSapdP0I'
}
var bot = new TelegramBot(telegramParams);

MqttClient.prototype.__proto__ = EventEmitter.prototype;
var mqttClient = new MqttClient(ipAddress);

mqttClient.client.on('message', (topic, message) => {
  var date = new Date();
  var timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  topic = topic.toString('utf8')
  sensorName = topic.split('/')[0];
  sensorTopic = topic.split('/')[1];
  message = message.toString('utf8');
  if(sensorTopic !== 'main'){
    Sensor.findOne({
      name: sensorName
    }, (err, sensor) => {
      if(err) return;
      let prevLastMsg = sensor.lastMessage;
      sensor.lastMessage = `${message} [${timestamp}]`;
      if(sensor.previousMsgs.length > 4) sensor.previousMsgs.pop();
      sensor.previousMsgs.unshift(prevLastMsg);
      sensor.save(console.log('saved maybe: ', sensor.previousMsgs));
      io.emit('data updated', topic);
      bot.sendAlert(message);
    });
  }
});

//Bot methods to mount and unmount and its helpers
bot.onCommand('/unmount', (msg) => {
  let topic = getKeyByValue(bot.users, msg.chat.id);
  unmountSensors(topic);
  io.emit('data updated');
});
bot.onCommand('/mount', (msg) => {
  let topic = getKeyByValue(bot.users, msg.chat.id);  
  mountSensors(topic);
  io.emit('data updated');
});

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

var mountSensors = (sensorName) => {
  Sensor.findOneAndUpdate({
    name: sensorName
  },{
    $set: { mounted: true }
  }, () =>{
    mqttClient.publish(`${sensorName}/main`, '-m');
    bot.sendAlert('Alarma armada');
  });  
}
var unmountSensors = (sensorName) => {
  Sensor.findOneAndUpdate({
    name: sensorName
  },{
    $set: { mounted: false }
  }, () =>{
    mqttClient.publish(`${sensorName}/main`, '-u'); // -u to unmount
    bot.sendAlert('Alarma desarmada');
  });  

}

//Subscribing mqtt client to everyone
Sensor.find({}, (error, sensors) => {
  var sensArray = [];
  sensors.forEach( sensor => {
    sensArray.push(sensor.getMagnetTopic());
    sensArray.push(sensor.getPirTopic());
    sensArray.push(sensor.getMainTopic());
  })
  mqttClient.subscribeAll(sensArray);
});