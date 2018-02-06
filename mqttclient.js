'use strict';

const MQTT = require('mqtt');

class MqttClient {
  constructor(ipAddress) {
    this.client = MQTT.connect(`mqtt://${ipAddress}`);
    this.ipAddress = ipAddress;

    this.client.on('connect', (message) => {
      console.log(`Client connected. Listening to address ${ipAddress}`);
    });

    // When we get a message, we immediately assume the movement sensor detected something
    this.client.on('message', (topic, message) => {
      message = message.toString('utf8')
      if (message === 'ALERT'){
        this.fireAction(topic, message);
      }else {
        console.log(message);
      }
    });
  }

  subscribeTo(topic){
    this.client.subscribe(topic);
    console.log('Subscribed to: ', topic)
  }

  subscribeAll(topics){
    topics.forEach(topic => {
      this.subscribeTo(topic);
    });
  }

  fireAction(topic, message){
    console.log(message);
    this.emit('alarm-fired', message);
  }

  publish(topic, message){
   this.client.publish(topic, message);
  }
}

module.exports = MqttClient;