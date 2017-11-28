const TelegramBot = require('node-telegram-bot-api');
const token = '465245321:AAFmSBcoun3wW48BZI7MWF1xogPVSapdP0I';
const bot = new TelegramBot(token, {polling: true});

const Sequelize = require('sequelize');

const MqttClient = require('./mqttclient');
const db = new Sequelize('db', '', '', {
  dialect: 'sqlite',
  storage: 'db.sqlite'
});
const Sensor = db.define('sensor', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

let ipAddress = '127.0.0.1';

var mqttClient = new MqttClient(ipAddress);

mqttClient.subscribeTo('gerry/test');


