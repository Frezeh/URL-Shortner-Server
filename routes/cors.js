const express = require('express');
const cors = require('cors');
const app = express();

//contains all the origins that this server is willing to accept.
const whitelist = ['http://localhost:3000', 'http://localhost:3001'];
let corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);