'use strict';

const TelegramApi = require('node-telegram-bot-api');

class TelegramBot {
  constructor(params){
    this.bot = new TelegramApi(params.token, {polling: true});
    this.users = params.keys || {};

    var commandRegister = '/add ';
    this.bot.on('message', (msg) => {
      if(msg.text.toString().toLowerCase().indexOf(commandRegister) === 0){
        let splitMessage = msg.text.toString().split(commandRegister);
        let name = splitMessage[1];
        this.users[name] = msg.chat.id;
        console.log(`Telegram: Added ${name} with id ${msg.chat.id}`);
      }
    });
  }

  onCommand( command, botCallback){
    
    this.bot.on('message', (msg) => {
      if (msg.text.toString().toLowerCase().indexOf(command) === 0){
        botCallback(msg);
      }
    });
  }

  sendMessage(id, message){
    console.log('sending message to id', id, ", message: ", message);
    this.bot.sendMessage(id, message);  
  }

  sendAlert(message){
    
    let usersMap = this.users;
    for (let user in usersMap){
      console.log('DEBUG ', user, message);
      this.sendMessage(usersMap[user], message);
    }
  }
}

module.exports = TelegramBot;