'use strict';
var path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

class WebServer {
  constructor(port){
    var app = express();

    this.port = port || 7777;

    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(express.static(__dirname + '/views'));
    app.use(bodyParser.json({ type: 'application/json' }));
    
    this.app = app;
    this.server = this.app.listen(7777, () => {
      console.log('Example app listening on port 7777!');
    });
  }
}

module.exports = WebServer;