'use strict';

const MQTT = require('mqtt');

class MqttClient {
  constructor(ipAddress) {
    this.client = MQTT.connect(ipAddress);
    this.ipAddress = ipAddress;

    this.client.on('connect', (message) => {
      console.log(`Client connected. Listening to address ${ipAddress}`);
    });

    this.client.on('message', (topic, message) => {
      message = message.toString('utf8')
      let topicStr = topic.toString('utf8');
      if (message === 'ALERT'){
        this.fireAlarm();
      }else {
        console.log(message);
      }
    });
  }

  subscribeTo(topic){
    this.client.subscribe(topic);
  }
}