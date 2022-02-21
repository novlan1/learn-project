var express = require("express");
var app = express();
var fs = require('fs');


var key = fs.readFileSync('private.key');
var cert = fs.readFileSync('mydomain.crt');

var options = {
    key: key,
    cert: cert
};

// Run static server
var https = require('https');
https.createServer(options, app).listen(8888); 
